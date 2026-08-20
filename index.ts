// Main API exports
export { WialonApi, WialonError } from "./src/api/core/core";
export { AuthApi } from "./src/api/core/modules/auth";
export { ReportsApi } from "./src/api/core/modules/reports";
export { UnitApi } from "./src/api/core/modules/units";
export { HardwareApi } from "./src/api/core/modules/hardware";

// Type exports
export type {
    ILoginParams,
    ILoginResponse,
    ILoginResult,
} from "./src/api/interfaces/core.interface";

export type { IGroupData, IUnitsSensors, IUnitsLastSensorsValues} from "./src/api/interfaces/units.interface";

export { WialonErrorCode, WialonErrorMessages } from "./src/api/types/errors";
