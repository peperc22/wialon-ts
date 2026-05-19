const commandProtocolType = {
  Tcp: "tcp",
  Virtual: "vrt",
  Sms: "gms",
  Auto: "auto",
} as const;
export type CommandProtocolType =
  (typeof commandProtocolType)[keyof typeof commandProtocolType];
