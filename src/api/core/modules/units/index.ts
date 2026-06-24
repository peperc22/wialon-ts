import type {HttpClient} from "@/config/http-client.ts";
import {getUnitGroup} from "@/api/core/modules/units/get-unit-group.ts";
import {executeCommand} from "@/api/core/modules/units/execute-command.ts";
import type {IGroupData, IUnitData, UnitSearchStrategy} from "@/api/interfaces/units.interface.ts";
import type {CommandProtocolType} from "@/api/types/commands.ts";
import {BY_CUSTOM_FIELD, BY_NAME, findUnit} from "@/api/core/modules/units/find-unit.ts";

export class UnitApi {
    constructor(private client: HttpClient) {
    }

    findUnit = (
        sid: string,
        value: string,
        strategy: UnitSearchStrategy,
        withDetails?: boolean,
    ): Promise<number | IUnitData> =>
        findUnit(this.client, sid, value, strategy, withDetails);

    findUnitByName = (
        sid: string,
        unitName: string,
        withDetails?: boolean,
    ): Promise<number | IUnitData> =>
        findUnit(this.client, sid, unitName, BY_NAME, withDetails);

    findUnitByCustomField = (
        sid: string,
        value: string,
        withDetails?: boolean,
    ): Promise<number | IUnitData> =>
        findUnit(this.client, sid, value, BY_CUSTOM_FIELD, withDetails);

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
