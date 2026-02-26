import type { AxiosInstance } from "axios";
import { WIALON_URL } from "../../config/config";
import axios from "axios";
import type { ILoginParams, ILoginResponse, ILoginResult } from "../interfaces/core.interface";
import { WialonErrorCode, WialonErrorMessages } from "../types/errors";
import { AuthAPI } from "./auth/login";

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

  constructor(baseUrl: string = WIALON_URL) {
    this.client = axios.create({
      baseURL: baseUrl,
      timeout: 30000,
    });

    this.auth = new AuthAPI(this.client);
  }
}
