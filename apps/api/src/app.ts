import cors from "cors";
import express, { type NextFunction, type Request, type Response } from "express";

import { config } from "./config";
import {
  getAlerts,
  getAttendance,
  getAutomations,
  getBootstrap,
  getCourses,
  getFinance,
  getHistory,
  getSchedule,
  getStudents,
  getTeachers
} from "./services/crm-service";

const asyncHandler =
  (handler: (request: Request, response: Response) => Promise<void>) =>
  (request: Request, response: Response, next: NextFunction) => {
    handler(request, response).catch(next);
  };

export const app = express();

app.use(
  cors({
    origin: config.webOrigin
  })
);
app.use(express.json());

app.get("/health", (_request, response) => {
  response.json({
    status: "ok",
    service: "topgrade-api"
  });
});

app.get(
  "/api/bootstrap",
  asyncHandler(async (_request, response) => {
    response.json(await getBootstrap());
  })
);

app.get(
  "/api/students",
  asyncHandler(async (_request, response) => {
    response.json(await getStudents());
  })
);

app.get(
  "/api/teachers",
  asyncHandler(async (_request, response) => {
    response.json(await getTeachers());
  })
);

app.get(
  "/api/courses",
  asyncHandler(async (_request, response) => {
    response.json(await getCourses());
  })
);

app.get(
  "/api/schedule",
  asyncHandler(async (_request, response) => {
    response.json(await getSchedule());
  })
);

app.get(
  "/api/attendance",
  asyncHandler(async (_request, response) => {
    response.json(await getAttendance());
  })
);

app.get(
  "/api/finance",
  asyncHandler(async (_request, response) => {
    response.json(await getFinance());
  })
);

app.get(
  "/api/automations",
  asyncHandler(async (_request, response) => {
    response.json(await getAutomations());
  })
);

app.get(
  "/api/alerts",
  asyncHandler(async (_request, response) => {
    response.json(await getAlerts());
  })
);

app.get(
  "/api/history",
  asyncHandler(async (_request, response) => {
    response.json(await getHistory());
  })
);

app.use(
  (
    error: unknown,
    _request: Request,
    response: Response,
    _next: NextFunction
  ) => {
    const message =
      error instanceof Error ? error.message : "Unexpected server error";

    response.status(500).json({
      message
    });
  }
);

