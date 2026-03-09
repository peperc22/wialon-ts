import type { AxiosInstance } from "axios";
import { WIALON_URL } from "../../config/config";
import axios from "axios";
import { WialonErrorMessages } from "../types/errors";
import { AuthAPI } from "./services/auth.ts";
import { ReportsAPI } from "./services/reports.ts";

export class WialonAuthError extends Error {
  public readonly code: number;
  public readonly isWialonError: boolean;
  public readonly originalError?: unknown;

  constructor(
    code: number,
    message?: string,
    originalError?: unknown
  ) {
    const errorMessage = message || WialonErrorMessages[code] || `Wialon error code: ${code}`;
    super(errorMessage);

    this.name = 'WialonAuthError';
    this.code = code;
    this.isWialonError = true;
    this.originalError = originalError;

    Error.captureStackTrace(this, this.constructor);
  }

}

export class CoreAPI {
  private client: AxiosInstance;
  public readonly auth: AuthAPI;
  public readonly report: ReportsAPI;

  constructor(baseUrl: string = WIALON_URL) {
    this.client = axios.create({
      baseURL: baseUrl,
      timeout: 30000,
    });

    this.auth = new AuthAPI(this.client);
    this.report = new ReportsAPI(this.client);
  }
}
