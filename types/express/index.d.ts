declare module "express" {
  import { IncomingMessage, ServerResponse } from "http";

  export interface Request extends IncomingMessage {
    query: Record<string, string | string[] | undefined>;
  }

  export interface Response extends ServerResponse {
    json: (body: unknown) => void;
  }

  export type NextFunction = () => void;

  export type RequestHandler = (
    req: Request,
    res: Response,
    next?: NextFunction
  ) => void;

  export interface ExpressApp {
    use: (handler: RequestHandler) => void;
    get: (path: string, handler: RequestHandler) => void;
    listen: (port: number, callback?: () => void) => void;
  }

  interface ExpressFactory {
    (): ExpressApp;
    json: () => RequestHandler;
  }

  const express: ExpressFactory;
  export default express;
}
