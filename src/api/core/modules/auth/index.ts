import type {HttpClient} from "../../../../config/http-client.ts";
import {login} from "./login.ts";
import {logout} from "./logout.ts";
import type {ILoginResult} from "../../../interfaces/core.interface.ts";

export class AuthApi {
    constructor(private client: HttpClient) {
    }

    login = (wialonToken: string): Promise<ILoginResult> =>
        login(this.client, wialonToken);

    logout = (sid: string): Promise<void> =>
        logout(this.client, sid);
}
