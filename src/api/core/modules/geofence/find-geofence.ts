import type { HttpClient } from "../../../../config/http-client";
import { WialonError } from "../../core";
import { WialonErrorCode } from "../../../types/errors";
import type { WialonResponse } from "../../../types/wialon";
import type { GeofenceSearchItem } from "../../../interfaces/geofences.interface";

export async function findGeofence(
    client: HttpClient,
    sid: string,
    geofenceName: string,
    resourceId: number,
): Promise<number> {
    const params = {
        spec: {
            itemsType: "avl_resource",
            propName: "zones_library",
            propValueMask: geofenceName,
            sortType: "zones_library",
            propType: "propitemname"
        },
        force: 1,
        flags: 4097,
        from: 0,
        to: 0,
    };

    try {
        const response = await client.get<WialonResponse<{ items: GeofenceSearchItem[] }>>("", {
            params: {
                svc: "core/search_items",
                params: JSON.stringify(params),
                sid,
            },
        });

        if ("error" in response.data && typeof response.data.error === "number")
            throw new WialonError(response.data.error);

        const data: GeofenceSearchItem[] = response.data.items;
        const item = data.find((obj) => obj.id === resourceId);
        if (!item)
            throw new WialonError(
                WialonErrorCode.UNKNOWN_ERROR,
                `Resource not found: ${resourceId}`,
            );

        const geofence = Object.values(item.zl).find((g) => g.n === geofenceName);
        if (!geofence)
            throw new WialonError(
                WialonErrorCode.UNKNOWN_ERROR,
                `Geofence not found: ${geofenceName} in resource ${resourceId}`,
            );

        return geofence.id;
    } catch (error) {
        if (error instanceof WialonError) throw error;

        throw new WialonError(
            WialonErrorCode.UNKNOWN_ERROR,
            "Unexpected error during unit search",
            error,
        );
    }
}