import type { AxiosInstance } from "axios";
import { WialonAuthError } from "../core";
import { WialonErrorCode } from "../../types/errors";

export class UnitApi {
  constructor(private client: AxiosInstance) { }

  async GetIdByName(sid: string, unitName: string): Promise<number> {
    const params = {
      spec: {
        itemsType: "avl_unit",
        propName: "sys_name",
        propValueMask: unitName,
        sortType: ""
      },
      force: 1,
      flags: 1,
      from: 0,
      to: 0
    };

    try {
      const response = await this.client.get('', {
        params: {
          svc: 'core/search_items',
          params: JSON.stringify(params),
          sid: sid
        }
      });

      if ('error' in response.data)
        throw new WialonAuthError(response.data.error);

      const id = response.data.items[0].id;

      return id;
    } catch (error) {
      if (error instanceof WialonAuthError)
        throw error;

      throw new WialonAuthError(
        WialonErrorCode.UNKNOWN_ERROR,
        'Unexpected error during unit search',
        error
      );
    }
  }
}

