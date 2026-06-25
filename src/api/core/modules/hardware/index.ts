import type {HttpClient} from "../../../../config/http-client.ts";
import {getHardwareInfo} from "./get-hardware-info.ts";

export class HardwareApi {
    constructor(private client: HttpClient) {
    }

    getHardwareInfo = (
        sid: string,
        hardwareId: number,
    ): Promise<{ model: string }> =>
        getHardwareInfo(this.client, sid, hardwareId);
}
