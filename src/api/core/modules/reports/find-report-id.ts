import type { HttpClient } from "../../../../config/http-client.ts";
import { WialonError } from "../../core.ts";
import { WialonErrorCode } from "../../../types/errors.ts";

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

export async function findReportId(
    client: HttpClient,
    sid: string,
    user: string,
    reportName: string,
    resourceId?: number,
): Promise<number> {
    const params = {
        spec: {
            itemsType: "avl_resource",
            propName: "",
            propValueMask: "",
            sortType: "",
            propType: "",
            or_logic: false,
        },
        force: 1,
        flags: 8193,
        from: 0,
        to: 0,
    };

    try {
        const response: { data: { items: ResourceItem[] } } =
            await client.get("", {
                params: {
                    svc: "core/search_items",
                    params: JSON.stringify(params),
                    sid,
                },
            });

        if ("error" in response.data && typeof response.data.error === "number")
            throw new WialonError(response.data.error);

        const data: ResourceItem[] = response.data.items;

        let item = data.find((obj) => obj.id === resourceId);
        if (!item) {
            item = data.find((obj) => obj.nm === user);

            if (!item)
                throw new WialonError(
                    WialonErrorCode.UNKNOWN_ERROR,
                    `Resource not found: ${user}`,
                );
        }

        const report = Object.values(item.rep).find((r) => r.n === reportName);
        if (!report) {
            throw new WialonError(
                WialonErrorCode.UNKNOWN_ERROR,
                `Report not found: ${reportName} in resource ${user}`,
            );
        }

        return report.id;
    } catch (error) {
        if (error instanceof WialonError) throw error;

        throw new WialonError(
            WialonErrorCode.UNKNOWN_ERROR,
            "Unexpected error during report search",
            error,
        );
    }
}
