import type { AxiosInstance } from "axios";
import { WialonAuthError } from "../core";
import { WialonErrorCode } from "../../types/errors";

interface Report {
  id: number;
  n: string;
  ct: string;
  c: number;
}

interface ResourceItem {
  nm: string;
  cls: number;
  id: number;
  mu: number;
  rep: Record<string, Report>;
}

export class ReportsAPI {
  constructor(private client: AxiosInstance) { }

  async ReportId(sid: string, user: string, reportName: string): Promise<number> {
    const params = {
      spec: {
        itemsType: "avl_resource",
        propName: "",
        propValueMask: "",
        sortType: "",
        propType: "",
        or_logic: false
      },
      force: 1,
      flags: 8193,
      from: 0,
      to: 0
    }

    try {
      const response = await this.client.get('', {
        params: {
          svc: 'core/search_items',
          params: JSON.stringify(params),
          sid
        }
      });

      if ('error' in response.data)
        throw new WialonAuthError(response.data.error);

      const data: ResourceItem[] = response.data.items;

      const item = data.find((obj) => obj.nm === user);
      if (!item) {
        throw new WialonAuthError(
          WialonErrorCode.UNKNOWN_ERROR,
          `Resource not found: ${user}`
        );
      }

      const report = Object.values(item.rep).find((r) => r.n === reportName);
      if (!report) {
        throw new WialonAuthError(
          WialonErrorCode.UNKNOWN_ERROR,
          `Report not found: ${reportName} in resource ${user}`
        );
      }

      return report.id;
    } catch (error) {
      if (error instanceof WialonAuthError)
        throw error;

      throw new WialonAuthError(
        WialonErrorCode.UNKNOWN_ERROR,
        'Unexpected error during report search',
        error
      );
    }
  }
}
