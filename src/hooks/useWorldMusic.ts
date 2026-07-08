import { useState, useSyncExternalStore } from "react";
import { worldMusic, REGIONS } from "../audio/worldMusic";

/** React binding over the singleton procedural music engine. */
export function useWorldMusic() {
	const playing = useSyncExternalStore(
		(cb) => worldMusic.onState(() => cb()),
		() => worldMusic.playing,
		() => false,
	);
	const [regionId, setRegionId] = useState(worldMusic.regionId);
	const [volume, setVolumeState] = useState(worldMusic.getVolume());

	const setRegion = (id: string) => {
		worldMusic.setRegion(id);
		setRegionId(id);
	};
	const setVolume = (v: number) => {
		worldMusic.setVolume(v);
		setVolumeState(v);
	};
	const toggle = () => worldMusic.toggle();

	return {
		playing,
		regionId,
		setRegion,
		volume,
		setVolume,
		toggle,
		regions: REGIONS,
	};
}
