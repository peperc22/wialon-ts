import type { AxiosInstance } from "axios";
import { WIALON_URL } from "../../config/config";
import axios from "axios";
import type { ILoginParams, ILoginResponse, ILoginResult } from "../interfaces/core.interface";
import { WialonErrorCode, WialonErrorMessages } from "../types/errors";

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

  constructor(baseUrl: string = WIALON_URL) {
    this.client = axios.create({
      baseURL: baseUrl,
      timeout: 30000,
    });
  }

  async login(wialonToken: string): Promise<ILoginResult> {
    const params: ILoginParams = { token: wialonToken };

    try {
      const response = await this.client.get<ILoginResponse>('', {
        params: {
          svc: 'token/login',
          params: JSON.stringify(params)
        }
      });

      if ('error' in response.data && typeof response.data.error === 'number')
        throw new WialonAuthError(response.data.error)

      const { eid: sid, user, au } = response.data;

      if (!sid || !user?.bact || !au)
        throw new WialonAuthError(WialonErrorCode.UNKNOWN_ERROR, 'Invalid login response: missing required fields');

      return {
        sid,
        resourceId: user.bact,
        user: au
      };
    } catch (error) {
      if (error instanceof WialonAuthError) {
        throw error;
      }

      if (axios.isAxiosError(error)) {
        throw new WialonAuthError(
          WialonErrorCode.UNKNOWN_ERROR,
          `Network error: ${error.message}`,
          error
        );
      }

      throw new WialonAuthError(
        WialonErrorCode.UNKNOWN_ERROR,
        'Unexpected error during login',
        error
      );
    }
  }
}
