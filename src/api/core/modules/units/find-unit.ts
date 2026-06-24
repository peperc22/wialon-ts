import type {IUnitData, UnitSearchItem, UnitSearchStrategy} from "@/api/interfaces/units.interface.ts";
import type {IWialonCommand} from "@/api/interfaces/commands.interface.ts";
import type {HttpClient} from "@/config/http-client.ts";
import type {WialonResponse} from "@/api/types/wialon.ts";
import {WialonError} from "@/api/core/core.ts";
import {WialonErrorCode} from "@/api/types/errors.ts";

const FULL_UNIT_FLAGS = "4611686018427387903";
const MINIMAL_DATA_FLAGS = 1;

export const BY_NAME: UnitSearchStrategy = Object.freeze({
    itemsType: "avl_unit",
    propName: "sys_name",
    label: "name",
});

export const BY_CUSTOM_FIELD: UnitSearchStrategy = Object.freeze({
    itemsType: "avl_unit",
    propName: "rel_customfield_value",
    label: "custom field",
});

function toUnitData(item: UnitSearchItem): IUnitData {
    return {
        id: item.id,
        gpsId: item.hw!,
        commands: Object.values(
            (item.cml ?? {}) as Record<string, IWialonCommand>,
        ).map((entry) => ({
                commandName: entry.n,
                commandParameter: entry.p,
            })
        ),
        lastReportUnixTime: item.lmsg?.t ?? null,
        gpsConnectionStatus: item.netconn ?? null,
    }
}

export async function findUnit(
    client: HttpClient,
    sid: string,
    value: string,
    strategy: UnitSearchStrategy = BY_NAME,
    withDetails?: boolean,
): Promise<number | IUnitData> {
    const params = {
        spec: {
            itemsType: strategy.itemsType,
            propName: strategy.propName,
            propValueMask: value,
            sortType: "",
        },
        force: 1,
        flags: withDetails ? FULL_UNIT_FLAGS : MINIMAL_DATA_FLAGS,
        from: 0,
        to: 0,
    };

    try {
        const response = await client.get<WialonResponse<{ items: UnitSearchItem[] }>>("", {
            params: {
                svc: "core/search_items",
                params: JSON.stringify(params),
                sid,
            },
        });

        if ("error" in response.data && typeof response.data.error === "number")
            throw new WialonError(response.data.error);

        const item = response.data.items[0];
        if (!item)
            throw new Error("no item found");

        return withDetails ? toUnitData(item) : item.id;
    } catch (error) {
        if (error instanceof WialonError) throw error;

        throw new WialonError(
            WialonErrorCode.UNKNOWN_ERROR,
            "Unexpected error during unit search",
            error,
        );
    }
}
