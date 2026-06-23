import {WIALON_URL} from "@/config/config.ts";
import {HttpClient} from "@/config/http-client.ts";
import {UnitApi} from "@/api/core/modules/units";
import {HardwareApi} from "@/api/core/modules/hardware";
import {ReportsApi} from "@/api/core/modules/reports";
import {AuthApi} from "@/api/core/modules/auth";
import {WialonErrorMessages} from "@/api/types/errors.ts";

export class WialonError extends Error {
    public readonly code: number;
    public readonly isWialonError: boolean;
    public readonly originalError?: unknown;

    constructor(code: number, message?: string, originalError?: unknown) {
        const errorMessage =
            message || WialonErrorMessages[code] || `Wialon error code: ${code}`;
        super(errorMessage);

        this.name = "WialonAuthError";
        this.code = code;
        this.isWialonError = true;
        this.originalError = originalError;

        Error.captureStackTrace(this, this.constructor);
    }
}

export class WialonApi {
    private client: HttpClient;
    public readonly auth: AuthApi;
    public readonly report: ReportsApi;
    public readonly unit: UnitApi;
    public readonly hardware: HardwareApi;

    constructor(baseUrl: string = WIALON_URL) {
        this.client = new HttpClient(baseUrl);

        this.auth = new AuthApi(this.client);
        this.report = new ReportsApi(this.client);
        this.unit = new UnitApi(this.client);
        this.hardware = new HardwareApi(this.client);
    }
}
