import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = fileURLToPath(new URL("../", import.meta.url));
const env = {
  ...process.env,
  NODE_ENV: "development",
  NEXT_DIST_DIR: ".next-local",
  PORT: "3101",
  DATABASE_URL: "postgresql://yoka:yoka_local@127.0.0.1:55432/yoka_local?schema=public",
  JWT_SECRET: "yoka-local-development-only",
  HOST_URL: "http://localhost:3100",
  REDIRECT_URL: "http://localhost:3100",
  NEXT_PUBLIC_API_URL: "http://localhost:3101/api/v1",
  API_INTERNAL_URL: "http://localhost:3101/api/v1",
  NEXT_PUBLIC_HOST_IMAGE: "http://localhost:3101/",
  VITE_API_URL: "http://localhost:3101/api/v1",
  VITE_HOST_IMAGE: "http://localhost:3101/",
};

function run(command, args, directory = ".") {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { cwd: path.join(root, directory), env, stdio: "inherit" });
    child.on("error", reject);
    child.on("exit", (code) => code === 0 ? resolve() : reject(new Error(`${command} ${args.join(" ")} exited with ${code}`)));
  });
}

try {
  if (process.argv.includes("--setup")) {
    for (const directory of ["yoka-api", "yoka-web", "yoga-admin"]) {
      await run("npm", ["ci"], directory);
    }
  } else {
    for (const directory of ["yoka-api", "yoka-web", "yoga-admin"]) {
      if (!existsSync(path.join(root, directory, "node_modules"))) {
        throw new Error("Install dependencies first: npm run local:setup");
      }
    }
  }
  if (!process.argv.includes("--existing-db")) {
    await run("docker", ["compose", "-p", "yoka-local", "-f", "compose.local.yml", "up", "-d", "--wait", "db"]);
  }
  await run("npx", ["--no-install", "prisma", "generate"], "yoka-api");
  // The historical migration does not contain the current schema. Only push to this dedicated local DB.
  await run("npx", ["--no-install", "prisma", "db", "push"], "yoka-api");
  if (!process.argv.includes("--setup")) {
    console.log("\nWeb: http://localhost:3100\nAdmin: http://localhost:5173\nAPI: http://localhost:3101/api/v1/health\n");
    const children = [];
    let stopping = false;
    function stop(code = 0) {
      if (stopping) return;
      stopping = true;
      for (const child of children) {
        try { process.kill(-child.pid, "SIGTERM"); } catch {}
      }
      process.exitCode = code;
    }
    process.on("SIGINT", () => stop());
    process.on("SIGTERM", () => stop());
    for (const [directory, args] of [
      ["yoka-api", ["run", "dev"]],
      ["yoka-web", ["run", "dev", "--", "--port", "3100"]],
      ["yoga-admin", ["run", "dev", "--", "--port", "5173", "--strictPort"]],
    ]) {
      const child = spawn("npm", args, { cwd: path.join(root, directory), env, stdio: "inherit", detached: true });
      children.push(child);
      child.on("error", (error) => { console.error(error.message); stop(1); });
      child.on("exit", (code) => { if (!stopping) stop(code || 1); });
    }
  }
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
