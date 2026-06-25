import type {HttpClient} from "../../../../config/http-client.ts";
import {WialonError} from "../../core.ts";
import {WialonErrorCode} from "../../../types/errors.ts";

export async function getHardwareInfo(
    client: HttpClient,
    sid: string,
    hardwareId: number,
): Promise<{ model: string }> {
    const params = {
        filterType: "id",
        filterValue: [hardwareId],
        includeType: true,
    };

    try {
        const response: any = await client.get("", {
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

        return {model: hardwareInfo};
    } catch (error) {
        if (error instanceof WialonError) throw error;

        throw new WialonError(
            WialonErrorCode.UNKNOWN_ERROR,
            "Unexpected error during hardware info retrieval",
            error,
        );
    }
}
