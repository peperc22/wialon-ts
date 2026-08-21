import type { HttpClient } from "../../../../config/http-client.ts";
import type {
    IDriverBehaviourEvent,
    IWialonDataMessage,
} from "../../../interfaces/units.interface.ts";
import type { WialonResponse } from "../../../types/wialon.ts";
import { WialonError } from "../../core.ts";
import { WialonErrorCode } from "../../../types/errors.ts";
import { unloadMessages } from "./unload-messages.ts";

const SUBALARM_NAMES: Readonly<Record<number, string>> = {
    0: "Fatigue driving",
    1: "No driver",
    2: "Phone call alarm",
    3: "Smoking",
    4: "Distraction",
    5: "LDW",
    6: "FCW",
    7: "Speed sign violation - not implemented.",
    8: "*reserved*",
    9: "Following too close.",
    10: "Yawning",
    11: "Pedestrian collision warning",
    12: "Aisle overcrowding",
    13: "Passengers on board outside the station",
    14: "The full line change lanes",
    15: "Watching and playing mobile phone",
    16: "Seat belts not fastened",
    17: "Driver certification failure",
    18: "Blind spot detection (right side)",
    19: "Forward collision warning (Virtual bumper)",
    20: "Two Hands break away from the wheel",
    21: "One hand break away from the wheel",
    22: "Glasses blocking",
    23: "Blind spot detection (left side)",
    24: "Passengers interfere with the driver's drivering",
};

interface LoadIntervalResponse {
    count: number;
    messages: IWialonDataMessage[];
}

export async function getDriverBehaviourEvents(
    client: HttpClient,
    sid: string,
    unitId: number,
    timeFrom: number,
    timeToExclusive: number,
): Promise<IDriverBehaviourEvent[]> {
    if (
        !Number.isInteger(timeFrom) ||
        !Number.isInteger(timeToExclusive)
    ) {
        throw new TypeError(
            "timeFrom and timeToExclusive must be Unix timestamps in seconds",
        );
    }

    if (timeToExclusive <= timeFrom) {
        throw new RangeError(
            "timeToExclusive must be greater than timeFrom",
        );
    }

    const timeTo = timeToExclusive - 1;

    const params = {
        itemId: unitId,
        timeFrom,
        timeTo,
        flags: 0,
        flagsMask: 0xff00,
        loadCount: 0xffffffff,
    };

    let loadAttempted = false;

    try {
        loadAttempted = true;

        const response = await client.get<
            WialonResponse<LoadIntervalResponse>
        >("", {
            params: {
                svc: "messages/load_interval",
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

        return response.data.messages.flatMap((message) => {
            const alarmType = message.p.alarmtype;
            const st = message.p.st;

            if (alarmType !== 56 || typeof st !== "number") {
                return [];
            }

            return [{
                timestamp: message.t,
                latitude: message.pos?.y ?? null,
                longitude: message.pos?.x ?? null,
                alarmType: 56 as const,
                st,
                name: SUBALARM_NAMES[st] ?? null,
            }];
        });
    } catch (error) {
        if (error instanceof WialonError) {
            throw error;
        }

        throw new WialonError(
            WialonErrorCode.UNKNOWN_ERROR,
            "Unexpected error while loading driver behaviour events",
            error,
        );
    } finally {
        if (loadAttempted) {
            await unloadMessages(client, sid).catch(() => undefined);
        }
    }
}
