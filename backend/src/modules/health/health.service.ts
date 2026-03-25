import type { BackendEnv } from "../../config/env.js";

export function buildHealthPayload(env: BackendEnv) {
  return {
    ok: true,
    service: "vaultdao-backend",
    network: env.stellarNetwork,
    contractId: env.contractId,
    timestamp: new Date().toISOString(),
  };
}

export function buildStatusPayload(env: BackendEnv) {
  return {
    service: "vaultdao-backend",
    environment: env.nodeEnv,
    rpcUrl: env.sorobanRpcUrl,
    horizonUrl: env.horizonUrl,
    websocketUrl: env.websocketUrl,
  };
}
