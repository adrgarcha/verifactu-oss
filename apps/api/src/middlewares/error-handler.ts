import { HTTPException } from "hono/http-exception";

import type { AppType } from "../app";

export function registerErrorHandlers(app: AppType): void {
  app.onError((error, c) => {
    if (error instanceof HTTPException) {
      return error.getResponse();
    }

    console.error("Unhandled API error", error);
    return c.json(
      {
        error: "Internal Server Error",
        requestId: c.get("requestId"),
      },
      500,
    );
  });

  app.notFound((c) => {
    return c.json(
      {
        error: "Not Found",
        path: c.req.path,
        requestId: c.get("requestId"),
      },
      404,
    );
  });
}
