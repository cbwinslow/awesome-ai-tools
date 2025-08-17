#!/usr/bin/env node
const inquirer = require("inquirer");
const { spawn } = require("child_process");
const fs = require("fs");

function runCmd(cmd) {
  return new Promise((resolve, reject) => {
    const [command, ...args] = cmd.split(" ");
    const child = spawn(command, args, { stdio: "inherit" });
    child.on("close", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${cmd} exited with code ${code}`));
    });
  });
}

function envExists() {
  return fs.existsSync(".env.local");
}

async function configure() {
  const { key } = await inquirer.prompt({
    type: "password",
    name: "key",
    message: "Enter OPENAI_API_KEY",
  });
  fs.writeFileSync(".env.local", `OPENAI_API_KEY=${key}\n`);
  console.log("Saved to .env.local");
}

async function main() {
  while (true) {
    const { action } = await inquirer.prompt({
      type: "list",
      name: "action",
      message: "Select action",
      choices: [
        "Start dev server",
        "Run tests",
        "Format code",
        "Configure API key",
        "Exit",
      ],
    });
    if (action === "Exit") break;
    try {
      if (action === "Start dev server") {
        if (!envExists()) {
          console.log('Missing .env.local. Run "Configure API key" first.');
          continue;
        }
        await runCmd("npm run dev");
      } else if (action === "Run tests") {
        await runCmd("npm test");
        await runCmd("pytest");
      } else if (action === "Format code") {
        await runCmd("npm run format");
      } else if (action === "Configure API key") {
        await configure();
      }
    } catch (err) {
      console.error("Action failed:", err.message);
    }
  }
}

main().catch((err) => console.error("Fatal error:", err.message));
