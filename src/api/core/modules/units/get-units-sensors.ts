import type { HttpClient } from "../../../../config/http-client.ts";
import type { IUnitsSensors } from "../../../interfaces/units.interface.ts";
import type { WialonResponse } from "../../../types/wialon.ts";
import { WialonError } from "../../core.ts";
import { WialonErrorCode } from "../../../types/errors.ts";

export async function getUnitsSensors(
    client: HttpClient,
    sid: string,
    unitIds: number[],
): Promise<IUnitsSensors[]> {
    const params = {
        spec: {
            itemsType: "avl_unit",
            propName: "sys_id",
            propValueMask: unitIds.join(","),
            sortType: "sys_name",
        },
        force: 1,
        flags: 4097,
        from: 0,
        to: 0,
    };

    try {
        const response = await client.get<
            WialonResponse<{ items: IUnitsSensors[] }>
        >("", {
            params: {
                svc: "core/search_items",
                params: JSON.stringify(params),
                sid,
            },
        });

        if (
            "error" in response.data &&
            typeof response.data.error === "number"
        ) {
            throw new WialonError(response.data.error);
        }

        return response.data.items;
    } catch (error) {
        if (error instanceof WialonError) throw error;

        throw new WialonError(
            WialonErrorCode.UNKNOWN_ERROR,
            "Unexpected error during units sensors search",
            error,
        );
    }
}