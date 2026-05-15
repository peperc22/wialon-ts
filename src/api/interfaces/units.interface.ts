import type { ICommand } from "./commands.interface";

export interface IGroupData {
  groupName: string;
  groupId: string;
  unitIds: number[];
}

export interface IUnitData {
  id: number;
  gpsId: number;
  commands: ICommand[];
}
