export interface ICommand {
  commandName: string;
  commandParameter: string;
}

/**
 *  Represents a command in the Wialon system, with its name (n) and parameter (p).
 */
export interface IWialonCommand {
  n: string;
  p: string;
}

export interface WialonLmsgObject {
  t: number | null;
}
