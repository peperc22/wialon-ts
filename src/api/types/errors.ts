export enum WialonErrorCode {
  SUCCESSFUL_OPERATION = 0,
  UNKNOWN_ERROR = 6,
  WRONG_TOKEN_LENGTH = 4,
  REQUEST_LIMIT = 1003,
  ACCESS_DENIED = 7,
  SUBUSER_NOT_FOUND = 8,
}

export const WialonErrorMessages: Record<number, string> = {
  [WialonErrorCode.SUCCESSFUL_OPERATION]: 'Successful operation',
  [WialonErrorCode.UNKNOWN_ERROR]: 'Unknown error ocurred',
  [WialonErrorCode.WRONG_TOKEN_LENGTH]: 'Invalid token length',
  [WialonErrorCode.REQUEST_LIMIT]: 'Request limit exceeded',
  [WialonErrorCode.ACCESS_DENIED]: 'Access denied - token not activated or no service access',
  [WialonErrorCode.SUBUSER_NOT_FOUND]: 'Subuser not found or insufficient access rights',
}
