import type { AxiosInstance } from "axios";
import { WialonError } from "../core";
import { WialonErrorCode } from "../../types/errors";
import type { IGroupData, IUnitData } from "../../interfaces/units.interface";
import type { IWialonCommand } from "../../interfaces/commands.interface";
import type { CommandProtocolType } from "../../types/commands";

export class UnitApi {
  constructor(private client: AxiosInstance) {}

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
      flags: withDetails ? 524545 : 1,
      from: 0,
      to: 0,
    };

    try {
      const response = await this.client.get("", {
        params: {
          svc: "core/search_items",
          params: JSON.stringify(params),
          sid: sid,
        },
      });

      if ("error" in response.data) throw new WialonError(response.data.error);

      const item = response.data.items[0];
      if (withDetails) {
        return {
          id: item.id,
          gpsId: item.hw,
          commands: Object.values(
            (item.cml ?? {}) as Record<string, IWialonCommand>,
          ).map((entry) => ({
            commandName: entry.n,
            commandParameter: entry.p,
          })),
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
      const response = await this.client.get("", {
        params: {
          svc: "core/search_items",
          params: JSON.stringify(params),
          sid: sid,
        },
      });

      if ("error" in response.data) throw new WialonError(response.data.error);

      const data = response.data.items[0];

      return {
        groupName: data.nm,
        groupId: data.id,
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
  ): Promise<void> {
    const params = {
      itemId: unitId,
      commandName,
      linkType: protocolType,
      param: commandParameter,
      timeout,
      flags: flags ?? 0,
    };

    try {
      const response = await this.client.get("", {
        params: {
          svc: "unit/exec_cmd",
          params: JSON.stringify(params),
          sid: sid,
        },
      });

      if ("error" in response.data) throw new WialonError(response.data.error);
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
