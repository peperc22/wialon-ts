import type { HttpClient } from "../../../config/http-client";
import { WialonError } from "../core";
import { WialonErrorCode } from "../../types/errors";

export class HardwareApi {
  constructor(private client: HttpClient) {}

  async getHardwareInfo(
    sid: string,
    hardwareId: number,
  ): Promise<{ model: string }> {
    const params = {
      filterType: "id",
      filterValue: [hardwareId],
      includeType: true,
    };

    try {
      const response: any = await this.client.get("", {
        params: {
          svc: "core/get_hw_types",
          params: JSON.stringify(params),
          sid: sid,
        },
      });

      if ("error" in response.data) {
        throw new Error(`Error fetching hardware info: ${response.data.error}`);
      }

      const hardwareInfo = response.data[0]?.name;

      return { model: hardwareInfo };
    } catch (error) {
      if (error instanceof WialonError) throw error;

      throw new WialonError(
        WialonErrorCode.UNKNOWN_ERROR,
        "Unexpected error during hardware info retrieval",
        error,
      );
    }
  }
}
