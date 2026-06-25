import type {HttpClient} from "../../../../config/http-client.ts";
import type {
    ILoginParams,
    ILoginResponse,
    ILoginResult,
} from "../../../interfaces/core.interface.ts";
import {WialonError} from "../../core.ts";
import {WialonErrorCode} from "../../../types/errors.ts";

export async function login(
    client: HttpClient,
    wialonToken: string,
): Promise<ILoginResult> {
    const params: ILoginParams = {token: wialonToken};

    try {
        const response = await client.get<ILoginResponse>("", {
            params: {
                svc: "token/login",
                params: JSON.stringify(params),
            },
        });

        if ("error" in response.data && typeof response.data.error === "number")
            throw new WialonError(response.data.error);

        const {eid: sid, user, au} = response.data;

        if (!sid || !user?.bact || !au)
            throw new WialonError(
                WialonErrorCode.UNKNOWN_ERROR,
                "Invalid login response: missing required fields",
            );

        return {
            sid,
            resourceId: user.bact,
            user: au,
        };
    } catch (error) {
        if (error instanceof WialonError) {
            throw error;
        }

        throw new WialonError(
            WialonErrorCode.UNKNOWN_ERROR,
            "Unexpected error during login",
            error,
        );
    }
}
