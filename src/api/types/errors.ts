export enum WialonErrorCode {
  SUCCESSFUL_OPERATION = 0,
  UNKNOWN_ERROR = 6,
  INVALID_INPUT = 4,
  REQUEST_LIMIT = 1003,
  ACCESS_DENIED = 7,
  SUBUSER_NOT_FOUND = 8,
}

export const WialonErrorMessages: Record<number, string> = {
  [WialonErrorCode.SUCCESSFUL_OPERATION]: 'Successful operation',
  [WialonErrorCode.INVALID_INPUT]: 'Invalid session | item not found | unknown error | internal error | non authorized | wrong token lenght',
  [WialonErrorCode.UNKNOWN_ERROR]: 'Unknown error ocurred',
  [WialonErrorCode.REQUEST_LIMIT]: 'Request limit exceeded',
  [WialonErrorCode.ACCESS_DENIED]: 'Access denied - token not activated or no service access',
  [WialonErrorCode.SUBUSER_NOT_FOUND]: 'Subuser not found or insufficient access rights',
}
