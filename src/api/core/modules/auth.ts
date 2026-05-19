import type { AxiosInstance } from "axios";
import type {
  ILoginParams,
  ILoginResponse,
  ILoginResult,
} from "../../interfaces/core.interface";
import { WialonError } from "../core";
import { WialonErrorCode } from "../../types/errors";
import axios from "axios";

export class AuthApi {
  constructor(private client: AxiosInstance) {}

  async login(wialonToken: string): Promise<ILoginResult> {
    const params: ILoginParams = { token: wialonToken };

    try {
      const response = await this.client.get<ILoginResponse>("", {
        params: {
          svc: "token/login",
          params: JSON.stringify(params),
        },
      });

      if ("error" in response.data && typeof response.data.error === "number")
        throw new WialonError(response.data.error);

      const { eid: sid, user, au } = response.data;

      if (!sid || !user?.bact || !au)
        throw new WialonError(
          WialonErrorCode.UNKNOWN_ERROR,
          "Invalid login response: missing required fields",
        );

      return {
        sid,
        resourceId: user.bact,
        user: au,
      };
    } catch (error) {
      if (error instanceof WialonError) {
        throw error;
      }

      if (axios.isAxiosError(error)) {
        throw new WialonError(
          WialonErrorCode.UNKNOWN_ERROR,
          `Network error: ${error.message}`,
          error,
        );
      }

      throw new WialonError(
        WialonErrorCode.UNKNOWN_ERROR,
        "Unexpected error during login",
        error,
      );
    }
  }

  async logout(sid: string): Promise<void> {
    try {
      const response = await this.client.get<{ error: number }>("", {
        params: {
          svc: "core/logout",
          params: JSON.stringify({}),
          sid,
        },
      });

      if ("error" in response.data && response.data.error !== 0)
        throw new WialonError(response.data.error);
    } catch (error) {
      if (error instanceof WialonError) throw error;

      if (axios.isAxiosError(error)) {
        throw new WialonError(
          WialonErrorCode.UNKNOWN_ERROR,
          `Network error: ${error.message}`,
          error,
        );
      }

      throw new WialonError(
        WialonErrorCode.UNKNOWN_ERROR,
        `Unexpected error during logout`,
        error,
      );
    }
  }
}
