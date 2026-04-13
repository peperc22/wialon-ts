// Main API exports
export { WialonApi, WialonAuthError } from "./src/api/core/core";
export { AuthApi } from "./src/api/core/modules/auth";
export { ReportsApi } from "./src/api/core/modules/reports";
export { UnitApi } from "./src/api/core/modules/units";

// Type exports
export type {
  ILoginParams,
  ILoginResponse,
  ILoginResult,
} from "./src/api/interfaces/core.interface";

export type { IGroupData } from "./src/api/interfaces/units.interface";

export { WialonErrorCode, WialonErrorMessages } from "./src/api/types/errors";
