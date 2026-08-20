import type { AxiosInstance } from "axios";
import { WialonAuthError } from "../core";
import { WialonErrorCode } from "../../types/errors";
import type { IGroupData, IUnitsSensors, IUnitsLastSensorsValues } from "../../interfaces/units.interface";

export class UnitApi {
  constructor(private client: AxiosInstance) {}

  async getUnitsSensors(sid: string, unitIds: number[]): Promise<IUnitsSensors[]> {
    const params = {
        spec: {
          itemsType: "avl_unit",
          propName: "sys_id",
          propValueMask: unitIds.join(','),
          sortType: "sys_name"
        },
      force: 1,
      flags: 4097,
      from: 0,
      to: 0,
    }

    try {
      const response = await this.client.get("", {
        params: {
          svc: "core/search_items",
          params: JSON.stringify(params),
          sid: sid,
        },
      });

      if ("error" in response.data)
        throw new WialonAuthError(response.data.error);

      const items = response.data.items

      return items
    } catch (error) {
      if (error instanceof WialonAuthError) throw error;

      throw new WialonAuthError(
        WialonErrorCode.UNKNOWN_ERROR,
        "Unexpected error during units sensors search",
        error,
      );
    }
  }

  async getLastUnitsSensorsValues(sid: string, unitIds: number[]): Promise<IUnitsLastSensorsValues[]> {
    const params = {
      "itemIds": unitIds
    }

    try {
      const response = await this.client.get("", {
        params: {
          svc: "unit/calc_last",
          params: JSON.stringify(params),
          sid: sid,
        },
      });

      if ("error" in response.data)
        throw new WialonAuthError(response.data.error);

      const unitsSensorsValues: IUnitsLastSensorsValues[] =
        response.data.map(({ i, sensors }) => ({
          i,
          sensors,
        }));

      return unitsSensorsValues
    } catch (error) {
      if (error instanceof WialonAuthError) throw error;

      throw new WialonAuthError(
        WialonErrorCode.UNKNOWN_ERROR,
        "Unexpected error during units sensors values search",
        error,
      );
    }
  }

  async findUnitByName(sid: string, unitName: string): Promise<number> {
    const params = {
      spec: {
        itemsType: "avl_unit",
        propName: "sys_name",
        propValueMask: unitName,
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

      if ("error" in response.data)
        throw new WialonAuthError(response.data.error);

      const id = response.data.items[0].id;

      return id;
    } catch (error) {
      if (error instanceof WialonAuthError) throw error;

      throw new WialonAuthError(
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

      if ("error" in response.data)
        throw new WialonAuthError(response.data.error);

      const data = response.data.items[0];

      return {
        groupName: data.nm,
        groupId: data.id,
        unitIds: data.u,
      };
    } catch (error) {
      if (error instanceof WialonAuthError) throw error;

      throw new WialonAuthError(
        WialonErrorCode.UNKNOWN_ERROR,
        "Unexpected error during group data retrieval",
        error,
      );
    }
  }
}
