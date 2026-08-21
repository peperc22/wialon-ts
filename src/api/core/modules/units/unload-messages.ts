import type { HttpClient } from "../../../../config/http-client.ts";
import { WialonError } from "../../core.ts";
import { WialonErrorCode } from "../../../types/errors.ts";

interface WialonUnloadResponse {
    error?: number;
    reason?: string;
}

export async function unloadMessages(
    client: HttpClient,
    sid: string,
): Promise<void> {
    try {
        const response = await client.get<WialonUnloadResponse>("", {
            params: {
                svc: "messages/unload",
                params: "{}",
                sid,
            },
        });

        if (typeof response.data.error === "number") {
            throw new WialonError(response.data.error);
        }
    } catch (error) {
        if (error instanceof WialonError) {
            throw error;
        }

        throw new WialonError(
            WialonErrorCode.UNKNOWN_ERROR,
            "Unexpected error while unloading messages",
            error,
        );
    }
}
