import type {HttpClient} from "@/config/http-client.ts";
import {WialonError} from "@/api/core/core.ts";
import {WialonErrorCode} from "@/api/types/errors.ts";

export async function getData(
    client: HttpClient,
    objectsLimit: number,
    sid: string,
) {
    const params = {
        tableIndex: 0,
        config: {
            type: "range",
            data: {
                from: 0,
                to: objectsLimit,
                level: 1,
                unitInfo: 1,
            },
        },
    };

    try {
        const response = await client.get("", {
            params: {
                svc: "report/select_result_rows",
                params: JSON.stringify(params),
                sid,
            },
        });

        return response.data;
    } catch (error) {
        if (error instanceof WialonError) throw error;

        throw new WialonError(
            WialonErrorCode.UNKNOWN_ERROR,
            "Unexpected error during getting report data",
            error,
        );
    }
}
