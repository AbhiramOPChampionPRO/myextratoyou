import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { type Server } from "http";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// request logging middleware (keeps existing behaviour)
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined;

  const originalResJson = res.json;
  // capture json responses for logging
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  res.json = function (bodyJson: any, ...args: any[]) {
    capturedJsonResponse = bodyJson;
    // @ts-ignore
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      if (logLine.length > 200) logLine = logLine.slice(0, 199) + "…";
      log(logLine);
    }
  });

  next();
});

const PORT = parseInt(process.env.PORT || "5000", 10);

async function start(): Promise<void> {
  try {
    // register routes and get underlying http.Server
    const server: Server = await registerRoutes(app);

    // central error handler
    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      const status = err?.status || err?.statusCode || 500;
      const message = err?.message || "Internal Server Error";
      res.status(status).json({ message });
      // also log and rethrow so startup fails when needed
      console.error("App error:", err);
      return;
    });

    // choose dev vs prod serving
    const env = process.env.NODE_ENV ?? app.get("env");
    log(`NODE_ENV=${env}`);
    if (env === "development") {
      log("Starting Vite dev middleware");
      await setupVite(app, server);
    } else {
      log("Serving static files from dist/public");
      serveStatic(app);
    }

    // start listening exactly once on the server returned by registerRoutes
    server.listen(PORT, "0.0.0.0", () => {
      log(`serving on port ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
}

start();