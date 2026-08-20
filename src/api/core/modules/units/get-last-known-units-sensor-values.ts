import type { HttpClient } from "../../../../config/http-client.ts";
import type { IUnitsLastSensorsValues } from "../../../interfaces/units.interface.ts";
import type { WialonResponse } from "../../../types/wialon.ts";
import { WialonError } from "../../core.ts";
import { WialonErrorCode } from "../../../types/errors.ts";

export async function getLastUnitsSensorsValues(
    client: HttpClient,
    sid: string,
    unitIds: number[],
): Promise<IUnitsLastSensorsValues[]> {
    const params = {
        itemIds: unitIds,
    };

    try {
        const response = await client.get<
            WialonResponse<IUnitsLastSensorsValues[]>
        >("", {
            params: {
                svc: "unit/calc_last",
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

        return response.data.map(({ i, sensors }) => ({
            i,
            sensors,
        }));
    } catch (error) {
        if (error instanceof WialonError) throw error;

        throw new WialonError(
            WialonErrorCode.UNKNOWN_ERROR,
            "Unexpected error during units sensors values search",
            error,
        );
    }
}