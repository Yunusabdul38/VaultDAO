import type { BackendEnv } from "./config/env.js";
import { createApp } from "./app.js";
import { loadEnv } from "./config/env.js";

export function startServer(env: BackendEnv = loadEnv()) {
  const app = createApp(env);

  const server = app.listen(env.port, env.host, () => {
    console.log(
      `[vaultdao-backend] listening on http://${env.host}:${env.port} for ${env.stellarNetwork}`,
    );
  });

  return server;
}
