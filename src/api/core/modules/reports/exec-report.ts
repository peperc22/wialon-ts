import type { HttpClient } from "../../../../config/http-client.ts";
import { WialonError } from "../../core.ts";
import { WialonErrorCode } from "../../../types/errors.ts";

export async function execReport(
  client: HttpClient,
  resourceId: string,
  reportId: number,
  objectId: number,
  unixDateFrom: number,
  unixDateTo: number,
  sid: string,
) {
  const params = {
    reportResourceId: resourceId,
    reportTemplateId: reportId,
    reportObjectId: objectId,
    reportObjectSecId: 0,
    interval: {
      from: unixDateFrom,
      to: unixDateTo,
      flags: 0,
    },
    remoteExec: 0,
    reportTemplate: [],
  };

  try {
    const response = await client.get<Record<string, unknown>>("", {
      params: {
        svc: "report/exec_report",
        params: JSON.stringify(params),
        sid,
      },
    });

    if ("error" in response.data && typeof response.data.error === "number")
      throw new WialonError(response.data.error);

    return true;
  } catch (error) {
    if (error instanceof WialonError) throw error;

    throw new WialonError(
      WialonErrorCode.UNKNOWN_ERROR,
      "Unexpected error during exec report",
      error,
    );
  }
}
