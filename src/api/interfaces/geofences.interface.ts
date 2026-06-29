export interface GeofenceSearchItem {
    id: number;
    zl: Record<string, Geofence>;
}

interface Geofence {
    id: number;
    n: string;
}