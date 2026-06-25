import type {IGroupData} from "../../../interfaces/units.interface.ts";
import {WialonError} from "../../core.ts";
import {WialonErrorCode} from "../../../types/errors.ts";
import type {WialonResponse} from "../../../types/wialon.ts";
import type {HttpClient} from "../../../../config/http-client.ts";

export async function getUnitGroup(
    client: HttpClient,
    sid: string,
    groupName: string
): Promise<IGroupData> {
    const params = {
        spec: {
            itemsType: "avl_unit_group",
            propName: "sys_name",
            propValueMask: groupName,
            sortType: "",
        },
        force: 1,
        flags: 1,
        from: 0,
        to: 0,
    };
    try {
        const response = await client.get<
            WialonResponse<{ items: { id: number; nm: string; u: number[] }[] }>
        >("", {
            params: {
                svc: "core/search_items",
                params: JSON.stringify(params),
                sid: sid,
            },
        });

        if ("error" in response.data && typeof response.data.error === "number")
            throw new WialonError(response.data.error);

        const data = response.data.items[0];
        if (!data)
            throw new Error("No group found");

        return {
            groupName: data.nm,
            groupId: String(data.id),
            unitIds: data.u,
        };
    } catch (error) {
        if (error instanceof WialonError) throw error;

        throw new WialonError(
            WialonErrorCode.UNKNOWN_ERROR,
            "Unexpected error during group data retrieval",
            error,
        );
    }
}