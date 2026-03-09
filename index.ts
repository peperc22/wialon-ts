// Main API exports
export { CoreAPI, WialonAuthError } from './src/api/core/core';
export { AuthAPI } from './src/api/core/services/auth';

// Type exports
export type {
  ILoginParams,
  ILoginResponse,
  ILoginResult
} from './src/api/interfaces/core.interface';

export { WialonErrorCode, WialonErrorMessages } from './src/api/types/errors';