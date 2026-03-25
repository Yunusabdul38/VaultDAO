import assert from "node:assert/strict";
import test from "node:test";

import { buildHealthPayload, buildStatusPayload } from "./health.service.js";

const mockEnv = {
  port: 8787,
  host: "0.0.0.0",
  nodeEnv: "test",
  stellarNetwork: "testnet",
  sorobanRpcUrl: "https://soroban-testnet.stellar.org",
  horizonUrl: "https://horizon-testnet.stellar.org",
  contractId: "CDTEST",
  websocketUrl: "ws://localhost:8080",
};

test("builds a healthy service payload", () => {
  const payload = buildHealthPayload(mockEnv);

  assert.equal(payload.ok, true);
  assert.equal(payload.service, "vaultdao-backend");
  assert.equal(payload.network, "testnet");
  assert.equal(payload.contractId, "CDTEST");
  assert.match(payload.timestamp, /^\d{4}-\d{2}-\d{2}T/);
});

test("builds a status payload", () => {
  const payload = buildStatusPayload(mockEnv);

  assert.equal(payload.service, "vaultdao-backend");
  assert.equal(payload.environment, "test");
  assert.match(payload.rpcUrl, /soroban-testnet/);
});
