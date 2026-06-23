import type {HttpClient} from "@/config/http-client.ts";
import {findReportId} from "@/api/core/modules/reports/find-report-id.ts";
import {execReport} from "@/api/core/modules/reports/exec-report.ts";
import {getData} from "@/api/core/modules/reports/get-data.ts";
import {cleanResult} from "@/api/core/modules/reports/clean-result.ts";

export class ReportsApi {
    constructor(private client: HttpClient) {
    }

    findReportId = (
        sid: string,
        user: string,
        reportName: string,
    ): Promise<number> =>
        findReportId(this.client, sid, user, reportName);

    execReport = (
        resourceId: string,
        reportId: number,
        objectId: number,
        unixDateFrom: number,
        unixDateTo: number,
        sid: string,
    ) =>
        execReport(this.client, resourceId, reportId, objectId, unixDateFrom, unixDateTo, sid);

    getData = (objectsLimit: number, sid: string) =>
        getData(this.client, objectsLimit, sid);

    cleanResult = (sid: string): Promise<boolean> =>
        cleanResult(this.client, sid);
}
