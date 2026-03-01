import type { MiddlewareHandler } from "hono";

export const requestIdMiddleware: MiddlewareHandler = async (c, next) => {
  const existing = c.req.header("x-request-id");
  const requestId = existing ?? crypto.randomUUID();
  c.set("requestId", requestId);
  c.res.headers.set("x-request-id", requestId);
  await next();
};
