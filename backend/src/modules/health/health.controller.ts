import type { RequestHandler } from "express";

import type { BackendEnv } from "../../config/env.js";
import {
  buildHealthPayload,
  buildStatusPayload,
} from "./health.service.js";

export function getHealthController(env: BackendEnv): RequestHandler {
  return (_request, response) => {
    response.status(200).json(buildHealthPayload(env));
  };
}

export function getStatusController(env: BackendEnv): RequestHandler {
  return (_request, response) => {
    response.status(200).json(buildStatusPayload(env));
  };
}
