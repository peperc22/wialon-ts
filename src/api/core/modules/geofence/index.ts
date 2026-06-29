import type { HttpClient } from "../../../../config/http-client";
import { findGeofence } from "./find-geofence";

export class GeofenceApi {
    constructor(private client: HttpClient) { }

    findGeofence = (
        sid: string,
        geofenceName: string,
        resourceId: number,
    ): Promise<number> =>
        findGeofence(this.client, sid, geofenceName, resourceId);
}