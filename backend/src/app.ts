import express from "express";

import type { BackendEnv } from "./config/env.js";
import { createHealthRouter } from "./modules/health/health.routes.js";

export function createApp(env: BackendEnv) {
  const app = express();

  app.use(express.json());
  app.use(createHealthRouter(env));

  app.use((_request, response) => {
    response.status(404).json({ ok: false, error: "Not Found" });
  });

  return app;
}
