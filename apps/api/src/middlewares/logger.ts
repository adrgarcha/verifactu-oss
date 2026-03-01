import type { MiddlewareHandler } from "hono";

export const loggerMiddleware: MiddlewareHandler = async (c, next) => {
  const start = Date.now();
  await next();
  const elapsed = Date.now() - start;
  const requestId = c.get("requestId");
  const line = `${c.req.method} ${c.req.path} -> ${c.res.status} ${elapsed}ms [${requestId}]`;
  if (c.res.status >= 500) {
    console.error(line);
    return;
  }
  console.info(line);
};
