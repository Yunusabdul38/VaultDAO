import { Router } from "express";

import type { BackendEnv } from "../../config/env.js";
import {
  getHealthController,
  getStatusController,
} from "./health.controller.js";

export function createHealthRouter(env: BackendEnv) {
  const router = Router();

  router.get("/health", getHealthController(env));
  router.get("/api/v1/status", getStatusController(env));

  return router;
}
