import type {HttpClient} from "@/config/http-client.ts";
import {getUnitGroup} from "@/api/core/modules/units/get-unit-group.ts";
import {executeCommand} from "@/api/core/modules/units/execute-command.ts";
import type {IGroupData, IUnitData} from "@/api/interfaces/units.interface.ts";
import {findUnitByName} from "@/api/core/modules/units/find-unit-by-name.ts";
import type {CommandProtocolType} from "@/api/types/commands.ts";

export class UnitApi {
    constructor(private client: HttpClient) {
    }

    findUnitByName = (
        sid: string,
        unitName: string,
        withDetails?: boolean,
    ): Promise<number | IUnitData> =>
        findUnitByName(this.client, sid, unitName, withDetails);

    getUnitGroup = (
        sid: string,
        groupName: string,
    ): Promise<IGroupData> =>
        getUnitGroup(this.client, sid, groupName);

    executeCommand = (
        sid: string,
        commandName: string,
        commandParameter: string,
        unitId: number,
        protocolType: CommandProtocolType,
        timeout: number,
        flags?: number,
    ): Promise<boolean> =>
        executeCommand(this.client, sid, commandName, commandParameter, unitId, protocolType, timeout, flags)
}
