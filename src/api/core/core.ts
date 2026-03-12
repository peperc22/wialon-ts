import type { AxiosInstance } from "axios";
import { WIALON_URL } from "../../config/config";
import axios from "axios";
import { WialonErrorMessages } from "../types/errors";
import { AuthApi } from "./services/auth.ts";
import { ReportsApi } from "./services/reports.ts";
import { UnitApi } from "./services/units.ts";

export class WialonAuthError extends Error {
  public readonly code: number;
  public readonly isWialonError: boolean;
  public readonly originalError?: unknown;

  constructor(code: number, message?: string, originalError?: unknown) {
    const errorMessage =
      message || WialonErrorMessages[code] || `Wialon error code: ${code}`;
    super(errorMessage);

    this.name = "WialonAuthError";
    this.code = code;
    this.isWialonError = true;
    this.originalError = originalError;

    Error.captureStackTrace(this, this.constructor);
  }
}

export class WialonAPI {
  private client: AxiosInstance;
  public readonly auth: AuthApi;
  public readonly report: ReportsApi;
  public readonly unit: UnitApi;

  constructor(baseUrl: string = WIALON_URL) {
    this.client = axios.create({
      baseURL: baseUrl,
      timeout: 30000,
    });

    this.auth = new AuthApi(this.client);
    this.report = new ReportsApi(this.client);
    this.unit = new UnitApi(this.client);
  }
}
