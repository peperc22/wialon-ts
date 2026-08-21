import type {HttpClient} from "../../../../config/http-client.ts";
import {getUnitGroup} from "./get-unit-group.ts";
import {executeCommand} from "./execute-command.ts";
import { getUnitsSensors } from "./get-units-sensors.ts";
import { getLastUnitsSensorsValues } from "./get-last-known-units-sensor-values.ts";
import { getDriverBehaviourEvents } from "./get-driver-behaviour-events.ts";
import type {
    IGroupData,
    IUnitData,
    IUnitsSensors,
    IUnitsLastSensorsValues,
    UnitSearchStrategy,
    IDriverBehaviourEvent,
} from "../../../interfaces/units.interface.ts";
import type {CommandProtocolType} from "../../../types/commands.ts";
import {BY_CUSTOM_FIELD, BY_NAME, findUnit} from "./find-unit.ts";

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

    getUnitsSensors = (
        sid: string,
        unitIds: number[],
    ): Promise<IUnitsSensors[]> =>
        getUnitsSensors(this.client, sid, unitIds);

    getLastUnitsSensorsValues = (
        sid: string,
        unitIds: number[],
    ): Promise<IUnitsLastSensorsValues[]> =>
        getLastUnitsSensorsValues(this.client, sid, unitIds);

    getDriverBehaviourEvents = (
        sid: string,
        unitId: number,
        timeFrom: number,
        timeToExclusive: number,
    ): Promise<IDriverBehaviourEvent[]> =>
        getDriverBehaviourEvents(
            this.client,
            sid,
            unitId,
            timeFrom,
            timeToExclusive,
        );
}
