import type { HttpClient } from "../../../../config/http-client.ts";
import type { CommandProtocolType } from "../../../types/commands.ts";
import { WialonError } from "../../core.ts";
import { WialonErrorCode } from "../../../types/errors.ts";

export async function executeCommand(
    client: HttpClient,
    sid: string,
    commandName: string,
    commandParameter: string,
    unitId: number,
    protocolType: CommandProtocolType,
    timeout: number,
    flags?: number,
): Promise<boolean | unknown> {
    const params = {
        itemId: unitId,
        commandName,
        linkType: protocolType,
        param: commandParameter,
        timeout,
        flags: flags ?? 0,
    };

    try {
        const response = await client.get<{ error?: number }>("", {
            params: {
                svc: "unit/exec_cmd",
                params: JSON.stringify(params),
                sid: sid,
            },
        });

        if ("error" in response.data && typeof response.data.error === "number")
            return response.data;

        return true;
    } catch (error) {
        if (error instanceof WialonError) throw error;

        throw new WialonError(
            WialonErrorCode.UNKNOWN_ERROR,
            "Unexpected error during command execution",
            error,
        );
    }
}