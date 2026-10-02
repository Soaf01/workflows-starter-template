import { processFeedback } from "./feedback.js";
import { runPipeline } from "./pipeline.js";

const args = process.argv.slice(2);
const command = args.find((a) => !a.startsWith("--")) ?? "run";
const dryRun = args.includes("--dry-run");

async function main(): Promise<void> {
  if (command === "run") {
    await runPipeline(dryRun);
  } else if (command === "feedback") {
    await processFeedback(dryRun);
  } else {
    console.error(`Commande inconnue : ${command}. Usage : run [--dry-run] | feedback [--dry-run]`);
    process.exitCode = 2;
  }
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
