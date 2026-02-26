export interface ILoginParams {
  token: string;
}

export interface ILoginResponse {
  eid: string;
  user: {
    bact: string
  };
  au: string;
  error?: number;
}

export interface ILoginResult {
  sid: string;
  resourceId: string;
  user: string;
}

