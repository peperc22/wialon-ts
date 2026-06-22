import type { HttpClient } from "../../../config/http-client";
import { WialonError } from "../core";
import { WialonErrorCode } from "../../types/errors";
import type { IGroupData, IUnitData } from "../../interfaces/units.interface";
import type {
  IWialonCommand,
  WialonLmsgObject,
} from "../../interfaces/commands.interface";
import type { CommandProtocolType } from "../../types/commands";
import type { WialonResponse } from "../../types/wialon";

interface UnitSearchItem {
  id: number;
  hw?: number;
  cml?: Record<string, IWialonCommand>;
  lmsg?: WialonLmsgObject;
  netconn?: number;
}

export class UnitApi {
  constructor(private client: HttpClient) {}

  async findUnitByName(
    sid: string,
    unitName: string,
    withDetails?: boolean,
  ): Promise<number | IUnitData> {
    const params = {
      spec: {
        itemsType: "avl_unit",
        propName: "sys_name",
        propValueMask: unitName,
        sortType: "",
      },
      force: 1,
      flags: withDetails ? "4611686018427387903" : 1,
      from: 0,
      to: 0,
    };

    try {
      const response = await this.client.get<
        WialonResponse<{ items: UnitSearchItem[] }>
      >("", {
        params: {
          svc: "core/search_items",
          params: JSON.stringify(params),
          sid: sid,
        },
      });

      if ("error" in response.data && typeof response.data.error === "number")
        throw new WialonError(response.data.error);

      const item = response.data.items[0];
      if (!item) throw new Error("No item found");

      if (withDetails) {
        return {
          id: item.id,
          gpsId: item.hw!,
          commands: Object.values(
            (item.cml ?? {}) as Record<string, IWialonCommand>,
          ).map((entry) => ({
            commandName: entry.n,
            commandParameter: entry.p,
          })),
          lastReportUnixTime: item.lmsg?.t ?? null,
          gpsConnectionStatus: item.netconn ?? null,
        };
      }

      return item.id;
    } catch (error) {
      if (error instanceof WialonError) throw error;

      throw new WialonError(
        WialonErrorCode.UNKNOWN_ERROR,
        "Unexpected error during unit search",
        error,
      );
    }
  }

  async getUnitGroup(sid: string, groupName: string): Promise<IGroupData> {
    const params = {
      spec: {
        itemsType: "avl_unit_group",
        propName: "sys_name",
        propValueMask: groupName,
        sortType: "",
      },
      force: 1,
      flags: 1,
      from: 0,
      to: 0,
    };
    try {
      const response = await this.client.get<
        WialonResponse<{ items: { id: number; nm: string; u: number[] }[] }>
      >("", {
        params: {
          svc: "core/search_items",
          params: JSON.stringify(params),
          sid: sid,
        },
      });

      if ("error" in response.data && typeof response.data.error === "number")
        throw new WialonError(response.data.error);

      const data = response.data.items[0];
      if (!data) throw new Error("No group found");

      return {
        groupName: data.nm,
        groupId: String(data.id),
        unitIds: data.u,
      };
    } catch (error) {
      if (error instanceof WialonError) throw error;

      throw new WialonError(
        WialonErrorCode.UNKNOWN_ERROR,
        "Unexpected error during group data retrieval",
        error,
      );
    }
  }

  async executeCommand(
    sid: string,
    commandName: string,
    commandParameter: string,
    unitId: number,
    protocolType: CommandProtocolType,
    timeout: number,
    flags?: number,
  ): Promise<boolean> {
    const params = {
      itemId: unitId,
      commandName,
      linkType: protocolType,
      param: commandParameter,
      timeout,
      flags: flags ?? 0,
    };

    try {
      const response = await this.client.get<{ error?: number }>("", {
        params: {
          svc: "unit/exec_cmd",
          params: JSON.stringify(params),
          sid: sid,
        },
      });

      if ("error" in response.data && typeof response.data.error === "number")
        return false;

      return true;
    } catch (error) {
      if (error instanceof WialonError) throw error;

      throw new WialonError(
        WialonErrorCode.UNKNOWN_ERROR,
        "Unexpected error during command execution",
        error,
      );
    }
  }
}
