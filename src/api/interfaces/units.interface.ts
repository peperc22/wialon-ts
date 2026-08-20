export interface IGroupData {
  groupName: string;
  groupId: string;
  unitIds: number[];
}

export interface IUnitsSensors {
  nm: string;
  cls: number;
  id: number;
  mu: number;
  sens: Record<string, IWialonSensorData>;
}

export interface IWialonSensorData {
  id: number;
  n: string;
  t: string;
  d: string;
  m: string;
  p: string;
  f: number;
  c: string;
  vt: number;
  vs: number;
  tbl: unknown[];
  ct: number;
  mt: number;
}

export interface IUnitsLastSensorsValues {
  i: number;
  sensors: Record<string, IWialonSensorValues>
}

export interface IWialonSensorValues {
  value: string | number,
  format: {
    value: string
  }
}
