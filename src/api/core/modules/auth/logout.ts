import type {HttpClient} from "../../../../config/http-client.ts";
import {WialonError} from "../../core.ts";
import {WialonErrorCode} from "../../../types/errors.ts";

export async function logout(client: HttpClient, sid: string): Promise<void> {
    try {
        const response = await client.get<{ error: number }>("", {
            params: {
                svc: "core/logout",
                params: JSON.stringify({}),
                sid,
            },
        });

        if ("error" in response.data && response.data.error !== 0)
            throw new WialonError(response.data.error);
    } catch (error) {
        if (error instanceof WialonError) throw error;

        throw new WialonError(
            WialonErrorCode.UNKNOWN_ERROR,
            `Unexpected error during logout`,
            error,
        );
    }
}
