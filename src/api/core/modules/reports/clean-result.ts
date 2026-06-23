import type {HttpClient} from "@/config/http-client.ts";
import {WialonError} from "@/api/core/core.ts";
import {WialonErrorCode} from "@/api/types/errors.ts";

export async function cleanResult(
    client: HttpClient,
    sid: string,
): Promise<boolean> {
    try {
        const response = await client.get<{ error: number }>("", {
            params: {
                svc: "report/cleanup_result",
                params: JSON.stringify({}),
                sid,
            },
        });

        if ("error" in response.data && response.data.error !== 0)
            throw new WialonError(response.data.error);

        return true;
    } catch (error) {
        if (error instanceof WialonError) throw error;

        throw new WialonError(
            WialonErrorCode.UNKNOWN_ERROR,
            "Unexpected error during cleaning report result",
            error,
        );
    }
}
