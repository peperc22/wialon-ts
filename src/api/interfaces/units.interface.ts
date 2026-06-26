import type {ICommand, IWialonCommand} from "./commands.interface";

export interface IGroupData {
    groupName: string;
    groupId: string;
    unitIds: number[];
}

export interface IUnitData {
    id: number;
    gpsId: number;
    commands: ICommand[];
    lastReportUnixTime: number | null;
    lastPositionUnixTime: number | null;
    gpsConnectionStatus: number | null;
}

/**
 * Wialon `itemsType` values accepted by `core/search_items` for unit queries.
 */
export type WialonItemType = "avl_unit" | "avl_unit_group" | "avl_resource";

/**
 * Which Wialon item property the search should match against.
 *  - "sys_name"             -> unit's display name
 *  - "rel_customfield_value" -> any custom field value (free-text VIN, plate, etc.)
 */
export type WialonSearchField = "sys_name" | "rel_customfield_value";

/**
 * Strategy object passed to `findUnit`. Encapsulates everything that varies
 * between "find by name" and "find by custom field" so the search body can
 * stay generic.
 */
export interface UnitSearchStrategy {
    readonly itemsType: WialonItemType;
    readonly propName: WialonSearchField;
    readonly label: string;
}

/** Raw shape returned by `core/search_items` for a single unit item. */
export interface UnitSearchItem {
    id: number;
    hw?: number;
    cml?: Record<string, IWialonCommand>;
    lmsg?: { t: number };
    pos?: { t: number };
    netconn?: number;
}