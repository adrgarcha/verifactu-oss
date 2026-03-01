import { createServer } from "node:http";

type FixtureServer = {
  url: string;
  close: () => Promise<void>;
};

export async function startFixtureServer(
  responseBody: string,
  statusCode = 200,
  contentType = "application/xml",
): Promise<FixtureServer> {
  const server = createServer((_, res) => {
    res.statusCode = statusCode;
    res.setHeader("content-type", contentType);
    res.end(responseBody);
  });

  await new Promise<void>((resolve) => {
    server.listen(0, "127.0.0.1", () => resolve());
  });

  const address = server.address();
  if (!address || typeof address === "string") {
    throw new Error("Failed to start fixture server");
  }

  return {
    url: `http://127.0.0.1:${address.port}`,
    close: async () => {
      await new Promise<void>((resolve, reject) => {
        server.close((error) => {
          if (error) {
            reject(error);
            return;
          }

          resolve();
        });
      });
    },
  };
}
