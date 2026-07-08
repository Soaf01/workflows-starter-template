/**
 * World-music ambience engine — 100% procedural, generated live with the
 * Web Audio API. No audio files, nothing copyrighted: just oscillators,
 * envelopes and a few scales that evoke musical traditions from around the
 * world. Each "region" is a mode + timbre + tempo. A gentle random walk over
 * the scale keeps the melody flowing without ever repeating.
 */

export interface Region {
	id: string;
	name: string;
	place: string;
	glyph: string;
	color: string;
	/** Root frequency in Hz. */
	root: number;
	/** Semitone offsets forming the scale. */
	scale: number[];
	/** Seconds per melodic step. */
	step: number;
	wave: OscillatorType;
	character: "pluck" | "breath" | "bell";
}

export const REGIONS: Region[] = [
	{
		id: "bosquet",
		name: "Bosquet",
		place: "brise & clochettes",
		glyph: "❀",
		color: "#7fa867",
		root: 261.63, // C4
		scale: [0, 2, 4, 7, 9], // major pentatonic
		step: 0.62,
		wave: "sine",
		character: "bell",
	},
	{
		id: "vallee",
		name: "Vallée dorée",
		place: "flûte des collines",
		glyph: "☘",
		color: "#e0a44b",
		root: 293.66, // D4
		scale: [0, 2, 4, 7, 9, 12], // major pentatonic + octave
		step: 0.5,
		wave: "triangle",
		character: "breath",
	},
	{
		id: "koto",
		name: "Jardin de Koto",
		place: "cordes pincées",
		glyph: "⛩",
		color: "#c64b6e",
		root: 277.18, // C#4
		scale: [0, 2, 3, 7, 8], // hirajoshi
		step: 0.56,
		wave: "triangle",
		character: "pluck",
	},
	{
		id: "bazar",
		name: "Bazar de sable",
		place: "luth du désert",
		glyph: "☾",
		color: "#cf8422",
		root: 246.94, // B3
		scale: [0, 1, 4, 5, 7, 8, 11], // hijaz / phrygian dominant
		step: 0.44,
		wave: "sawtooth",
		character: "pluck",
	},
	{
		id: "sierra",
		name: "Sierra alta",
		place: "souffle des cimes",
		glyph: "⛰",
		color: "#5a8fb0",
		root: 329.63, // E4
		scale: [0, 3, 5, 7, 10], // minor pentatonic
		step: 0.58,
		wave: "triangle",
		character: "breath",
	},
	{
		id: "placeta",
		name: "Placeta",
		place: "guitare du sud",
		glyph: "✦",
		color: "#b0603a",
		root: 220.0, // A3
		scale: [0, 1, 3, 5, 7, 8, 10], // phrygian
		step: 0.46,
		wave: "sawtooth",
		character: "pluck",
	},
];

type StateListener = (playing: boolean) => void;

type WindowWithAudio = typeof globalThis & {
	webkitAudioContext?: typeof AudioContext;
};

class WorldMusicEngine {
	private ctx: AudioContext | null = null;
	private master: GainNode | null = null;
	private wet: GainNode | null = null;
	private delay: DelayNode | null = null;
	private feedback: GainNode | null = null;
	private lowpass: BiquadFilterNode | null = null;
	private voiceBus: GainNode | null = null;
	private droneGain: GainNode | null = null;
	private droneOscs: OscillatorNode[] = [];

	private timer: ReturnType<typeof setInterval> | null = null;
	private nextNoteTime = 0;
	private stepIndex = 0;
	private degree = 0;

	private region: Region = REGIONS[0];
	private volume = 0.6;
	playing = false;
	private listeners = new Set<StateListener>();

	get regionId() {
		return this.region.id;
	}

	onState(cb: StateListener) {
		this.listeners.add(cb);
		return () => this.listeners.delete(cb);
	}

	private emit() {
		for (const cb of this.listeners) cb(this.playing);
	}

	private ensureContext() {
		if (this.ctx) return;
		const Ctor =
			window.AudioContext || (window as WindowWithAudio).webkitAudioContext;
		if (!Ctor) return;
		const ctx = new Ctor();
		this.ctx = ctx;

		this.master = ctx.createGain();
		this.master.gain.value = 0;

		this.lowpass = ctx.createBiquadFilter();
		this.lowpass.type = "lowpass";
		this.lowpass.frequency.value = 2600;
		this.lowpass.Q.value = 0.4;

		// Simple feedback delay for a sense of space (pseudo-reverb).
		this.delay = ctx.createDelay(1.0);
		this.delay.delayTime.value = 0.29;
		this.feedback = ctx.createGain();
		this.feedback.gain.value = 0.34;
		this.wet = ctx.createGain();
		this.wet.gain.value = 0.32;

		this.voiceBus = ctx.createGain();
		this.voiceBus.gain.value = 1;

		// dry path
		this.voiceBus.connect(this.lowpass);
		// wet path
		this.voiceBus.connect(this.delay);
		this.delay.connect(this.feedback);
		this.feedback.connect(this.delay);
		this.delay.connect(this.wet);
		this.wet.connect(this.lowpass);

		this.lowpass.connect(this.master);
		this.master.connect(ctx.destination);

		this.droneGain = ctx.createGain();
		this.droneGain.gain.value = 0;
		this.droneGain.connect(this.lowpass);
	}

	private freq(degree: number, octave: number) {
		const scale = this.region.scale;
		const n = scale.length;
		const wrapped = ((degree % n) + n) % n;
		const octShift = Math.floor(degree / n) + octave;
		const semis = scale[wrapped] + octShift * 12;
		return this.region.root * Math.pow(2, semis / 12);
	}

	private startDrone() {
		if (!this.ctx || !this.droneGain) return;
		this.stopDrone();
		const now = this.ctx.currentTime;
		const roots = [this.region.root / 2, (this.region.root / 2) * Math.pow(2, 7 / 12)];
		for (const f of roots) {
			const osc = this.ctx.createOscillator();
			osc.type = "sine";
			osc.frequency.value = f;
			const g = this.ctx.createGain();
			g.gain.value = 0.5;
			osc.connect(g);
			g.connect(this.droneGain);
			osc.start(now);
			this.droneOscs.push(osc);
		}
		this.droneGain.gain.cancelScheduledValues(now);
		this.droneGain.gain.setValueAtTime(this.droneGain.gain.value, now);
		this.droneGain.gain.linearRampToValueAtTime(0.06, now + 3);
	}

	private stopDrone() {
		if (!this.ctx) return;
		const now = this.ctx.currentTime;
		for (const osc of this.droneOscs) {
			try {
				osc.stop(now + 0.05);
			} catch {
				/* already stopped */
			}
		}
		this.droneOscs = [];
	}

	private scheduleNote(time: number) {
		if (!this.ctx || !this.voiceBus) return;
		const ctx = this.ctx;

		// Random walk over the scale with occasional rests and octave lifts.
		if (Math.random() < 0.22) {
			this.stepIndex++;
			return;
		}
		const move = [-2, -1, -1, 1, 1, 2, 3][Math.floor(Math.random() * 7)];
		this.degree = Math.max(-2, Math.min(this.region.scale.length + 2, this.degree + move));
		const octave = Math.random() < 0.18 ? 1 : 0;
		const frequency = this.freq(this.degree, octave);

		const osc = ctx.createOscillator();
		osc.type = this.region.wave;
		osc.frequency.setValueAtTime(frequency, time);

		const g = ctx.createGain();
		osc.connect(g);
		g.connect(this.voiceBus);

		const peak = 0.18 + Math.random() * 0.08;
		const c = this.region.character;

		if (c === "breath") {
			// Soft attack, gentle vibrato, long release — flute-like.
			const dur = this.region.step * (1.4 + Math.random());
			g.gain.setValueAtTime(0.0001, time);
			g.gain.linearRampToValueAtTime(peak * 0.8, time + 0.09);
			g.gain.setValueAtTime(peak * 0.8, time + dur * 0.5);
			g.gain.exponentialRampToValueAtTime(0.0001, time + dur);
			const lfo = ctx.createOscillator();
			lfo.frequency.value = 5;
			const lg = ctx.createGain();
			lg.gain.value = frequency * 0.006;
			lfo.connect(lg);
			lg.connect(osc.frequency);
			lfo.start(time);
			lfo.stop(time + dur);
			osc.start(time);
			osc.stop(time + dur + 0.05);
		} else if (c === "bell") {
			const dur = this.region.step * (1.8 + Math.random());
			g.gain.setValueAtTime(0.0001, time);
			g.gain.exponentialRampToValueAtTime(peak, time + 0.02);
			g.gain.exponentialRampToValueAtTime(0.0001, time + dur);
			osc.start(time);
			osc.stop(time + dur + 0.05);
		} else {
			// pluck — fast attack, quick exp decay (string/oud/koto).
			const dur = this.region.step * (0.9 + Math.random() * 0.6);
			g.gain.setValueAtTime(0.0001, time);
			g.gain.exponentialRampToValueAtTime(peak, time + 0.012);
			g.gain.exponentialRampToValueAtTime(0.0001, time + dur);
			osc.start(time);
			osc.stop(time + dur + 0.05);
		}

		this.stepIndex++;
	}

	private tick = () => {
		if (!this.ctx) return;
		const scheduleAhead = 0.3;
		while (this.nextNoteTime < this.ctx.currentTime + scheduleAhead) {
			this.scheduleNote(this.nextNoteTime);
			// Humanise timing very slightly.
			const jitter = (Math.random() - 0.5) * 0.02;
			this.nextNoteTime += this.region.step + jitter;
		}
	};

	async play() {
		this.ensureContext();
		if (!this.ctx || !this.master) return;
		if (this.ctx.state === "suspended") await this.ctx.resume();
		this.playing = true;
		this.emit();

		const now = this.ctx.currentTime;
		this.master.gain.cancelScheduledValues(now);
		this.master.gain.setValueAtTime(this.master.gain.value, now);
		this.master.gain.linearRampToValueAtTime(this.volume * 0.3, now + 1.2);

		this.nextNoteTime = now + 0.1;
		this.startDrone();
		if (this.timer) clearInterval(this.timer);
		this.timer = setInterval(this.tick, 60);
	}

	pause() {
		if (!this.ctx || !this.master) {
			this.playing = false;
			this.emit();
			return;
		}
		const now = this.ctx.currentTime;
		this.master.gain.cancelScheduledValues(now);
		this.master.gain.setValueAtTime(this.master.gain.value, now);
		this.master.gain.linearRampToValueAtTime(0, now + 0.5);
		if (this.droneGain) {
			this.droneGain.gain.cancelScheduledValues(now);
			this.droneGain.gain.linearRampToValueAtTime(0, now + 0.5);
		}
		if (this.timer) {
			clearInterval(this.timer);
			this.timer = null;
		}
		this.stopDrone();
		this.playing = false;
		this.emit();
	}

	toggle() {
		return this.playing ? (this.pause(), Promise.resolve()) : this.play();
	}

	setRegion(id: string) {
		const next = REGIONS.find((r) => r.id === id);
		if (!next) return;
		this.region = next;
		this.degree = 0;
		if (this.playing) {
			this.startDrone();
			if (this.lowpass && this.ctx) {
				const now = this.ctx.currentTime;
				const cutoff = next.character === "breath" ? 2800 : next.character === "bell" ? 2400 : 3200;
				this.lowpass.frequency.linearRampToValueAtTime(cutoff, now + 0.4);
			}
		}
	}

	setVolume(v: number) {
		this.volume = Math.max(0, Math.min(1, v));
		if (this.ctx && this.master && this.playing) {
			const now = this.ctx.currentTime;
			this.master.gain.linearRampToValueAtTime(this.volume * 0.3, now + 0.15);
		}
	}

	getVolume() {
		return this.volume;
	}
}

export const worldMusic = new WorldMusicEngine();
