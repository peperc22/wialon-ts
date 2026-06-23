import type {IGroupData, IUnitData} from "@/api/interfaces/units.interface";
import type { WialonResponse } from "@/api/types/wialon";
import type { HttpClient } from "@/config/http-client";
import { WialonError } from "../../core";
import type {IWialonCommand, WialonLmsgObject} from "@/api/interfaces/commands.interface";
import { WialonErrorCode } from "@/api/types/errors";


interface UnitSearchItem {
    id: number;
    hw?: number;
    cml?: Record<string, IWialonCommand>;
    lmsg?: WialonLmsgObject;
    netconn?: number;
}

export async function findUnitByName(
    client: HttpClient,
    sid: string,
    unitName: string,
    withDetails?: boolean,
): Promise<number | IUnitData> {
    const params = {
        spec: {
            itemsType: "avl_unit",
            propName: "sys_name",
            propValueMask: unitName,
            sortType: "",
        },
        force: 1,
        flags: withDetails ? "4611686018427387903" : 1,
        from: 0,
        to: 0,
    };

    try {
        const response = await client.get<WialonResponse<{ items: UnitSearchItem[] }>>("", {
            params: {
                svc: "core/search_items",
                params: JSON.stringify(params),
                sid: sid,
            },
        });

        if ("error" in response.data && typeof response.data.error === "number")
            throw new WialonError(response.data.error);

        const item = response.data.items[0];
        if (!item) throw new Error("No item found");

        if (withDetails) {
            return {
                id: item.id,
                gpsId: item.hw!,
                commands: Object.values(
                    (item.cml ?? {}) as Record<string, IWialonCommand>,
                ).map((entry) => ({
                    commandName: entry.n,
                    commandParameter: entry.p,
                })),
                lastReportUnixTime: item.lmsg?.t ?? null,
                gpsConnectionStatus: item.netconn ?? null,
            };
        }

        return item.id;
    } catch (error) {
        if (error instanceof WialonError) throw error;

        throw new WialonError(
            WialonErrorCode.UNKNOWN_ERROR,
            "Unexpected error during unit search",
            error,
        );
    }
}