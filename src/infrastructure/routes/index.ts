import { Application } from "express";
import candidatRoutes from "./candidat.routes";
import recruteurRoutes from "./recruteur.routes";
import entretienRoutes from './entretien.routes';
import { AppError } from "../../shared/apiError";
import type express from 'express'

function defineErrorHandlingExpressMiddleware (
  error: unknown,
  _req: express.Request,
  res: express.Response,
  _next: express.NextFunction
): void {
  // ✅ Pass all error to a centralized error handler so they get treated equally
  console.log(error)

  if (error instanceof AppError) {
    res
      .status(error.HttpStatus)
      .json({
          message: error.message,
      }).end()
  } else {
    res
      .status(500)
      .json({
          message: 'Internal server error'
      }).end()
  }
}

export default class Routes {
  constructor(app: Application) {
    app.use(defineErrorHandlingExpressMiddleware)
    app.use("/api/candidat", candidatRoutes);
    app.use("/api/recruteur", recruteurRoutes);
    app.use("/api/entretien", entretienRoutes);
  }
}
