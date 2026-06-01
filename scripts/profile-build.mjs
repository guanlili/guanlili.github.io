import { spawn } from "node:child_process";

const steps = [
  ["content", ["npm", "run", "check:content"]],
  ["astro-check", ["npm", "run", "check"]],
  ["astro-build", ["node_modules/.bin/astro", "build"]],
  ["pagefind", ["node_modules/.bin/pagefind", "--site", "dist"]],
  ["dist-check", ["npm", "run", "check:dist"]],
];

function formatMs(ms) {
  const seconds = ms / 1000;
  if (seconds < 60) return `${seconds.toFixed(1)}s`;
  const minutes = Math.floor(seconds / 60);
  return `${minutes}m ${(seconds % 60).toFixed(1)}s`;
}

function runStep(label, command) {
  const started = Date.now();
  console.log(`\n[profile] ${label} started: ${command.join(" ")}`);

  return new Promise((resolve, reject) => {
    const child = spawn(command[0], command.slice(1), {
      cwd: process.cwd(),
      env: process.env,
      stdio: "inherit",
      shell: false,
    });

    child.on("error", reject);
    child.on("close", (code) => {
      const duration = Date.now() - started;
      if (code === 0) {
        console.log(`[profile] ${label} finished in ${formatMs(duration)}`);
        resolve({ label, duration });
      } else {
        reject(new Error(`[profile] ${label} failed after ${formatMs(duration)} with exit code ${code}`));
      }
    });
  });
}

const results = [];
const started = Date.now();

try {
  for (const [label, command] of steps) {
    results.push(await runStep(label, command));
  }
} catch (error) {
  console.error(error.message);
  process.exit(1);
}

const total = Date.now() - started;
console.log("\n[profile] summary");
for (const result of results) {
  const pct = ((result.duration / total) * 100).toFixed(1);
  console.log(`- ${result.label}: ${formatMs(result.duration)} (${pct}%)`);
}
console.log(`- total: ${formatMs(total)}`);
