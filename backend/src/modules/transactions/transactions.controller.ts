import type { RequestHandler } from "express";
import { success, error } from "../../shared/http/response.js";
import { ErrorCode } from "../../shared/http/errorCodes.js";
import { validatePagination } from "../../shared/http/validateQuery.js";
import type { TransactionsService } from "./transactions.service.js";

function getSingleQueryString(
  query: Record<string, unknown>,
  key: string,
): string | undefined {
  const value = query[key];
  if (value === undefined) return undefined;
  if (Array.isArray(value)) {
    const first = value[0];
    return typeof first === "string" ? first : undefined;
  }
  return typeof value === "string" ? value : undefined;
}

/**
 * GET /api/v1/transactions
 *
 * Query parameters:
 * - contractId: string (optional, falls back to env default passed at construction)
 * - token:      string (optional)
 * - recipient:  string (optional)
 * - from:       number (optional) - minimum ledger
 * - to:         number (optional) - maximum ledger
 * - limit:      number (optional, default: 20, max: 100)
 * - offset:     number (optional, default: 0)
 */
export function getTransactionsController(
  service: TransactionsService,
  defaultContractId: string,
): RequestHandler {
  return async (request, response) => {
    const pagination = validatePagination(request, response);
    if (!pagination) return;

    const token = getSingleQueryString(request.query as any, "token");
    const recipient = getSingleQueryString(request.query as any, "recipient");
    const fromRaw = getSingleQueryString(request.query as any, "from");
    const toRaw = getSingleQueryString(request.query as any, "to");

    let from: number | undefined;
    if (fromRaw !== undefined && fromRaw !== "") {
      const parsed = Number(fromRaw);
      if (!Number.isInteger(parsed) || parsed < 0) {
        error(response, {
          message: `Invalid from: expected a non-negative integer, received "${fromRaw}"`,
          status: 400,
          code: ErrorCode.BAD_REQUEST,
        });
        return;
      }
      from = parsed;
    }

    let to: number | undefined;
    if (toRaw !== undefined && toRaw !== "") {
      const parsed = Number(toRaw);
      if (!Number.isInteger(parsed) || parsed < 0) {
        error(response, {
          message: `Invalid to: expected a non-negative integer, received "${toRaw}"`,
          status: 400,
          code: ErrorCode.BAD_REQUEST,
        });
        return;
      }
      to = parsed;
    }

    if (from !== undefined && to !== undefined && from > to) {
      error(response, {
        message: "Invalid ledger range: from must be less than or equal to to",
        status: 400,
        code: ErrorCode.BAD_REQUEST,
      });
      return;
    }

    try {
      const contractId =
        typeof request.query.contractId === "string" && request.query.contractId.trim()
          ? request.query.contractId.trim()
          : defaultContractId;

      const result = await service.getTransactions({
        contractId,
        token,
        recipient,
        from,
        to,
        limit: pagination.limit,
        offset: pagination.offset,
      });
      success(response, result);
    } catch (err) {
      error(response, {
        message: "Failed to fetch transaction history",
        status: 500,
        code: ErrorCode.INTERNAL_ERROR,
        details: err instanceof Error ? err.message : undefined,
      });
    }
  };
}

/**
 * GET /api/v1/transactions/:txHash
 */
export function getTransactionByHashController(
  service: TransactionsService,
  defaultContractId: string,
): RequestHandler {
  return async (request, response) => {
    try {
      const contractId =
        typeof request.query.contractId === "string" && request.query.contractId.trim()
          ? request.query.contractId.trim()
          : defaultContractId;
      const txHash = String(request.params.txHash);
      const transaction = await service.getTransactionByHash(contractId, txHash);

      if (!transaction) {
        error(response, {
          message: "Transaction not found",
          status: 404,
          code: ErrorCode.NOT_FOUND,
        });
        return;
      }

      success(response, transaction);
    } catch (err) {
      error(response, {
        message: "Failed to fetch transaction",
        status: 500,
        code: ErrorCode.INTERNAL_ERROR,
        details: err instanceof Error ? err.message : undefined,
      });
    }
  };
}
