
import { AuthKey, Server, RegistrationHook } from "./types.js";
import { Authenticator  } from "./auth.js";

export class Controller {

    private authenticator: Authenticator
    private authkey: AuthKey | undefined
    private registrationHook: RegistrationHook | undefined

    constructor(server: Server) {
        this.authenticator = new Authenticator(server)
        this.authkey = undefined
        this.registrationHook = undefined
    }

    public async setMockAuthKey(id: string) {
        return this.authkey = new AuthKey(
            id, 
            `player-${id}`, 
            `player-${id}@dev.com`, 
            `dev-guest-${id}`
        )
    }

    public async loginWithGoogle(google_oauth_token: string) {
        return this.authkey = await this.authenticator
            .loginWithGoogle(google_oauth_token)
    }

    public async loginWithMicroChess(username: string, password: string) {
        return this.authkey = await this.authenticator
            .loginWithMicroChess(username, password)
    }

    public async registerWithMicroChess(username: string, email: string, password: string) {
        return this.registrationHook = 
            await this.authenticator.registerWithMicroChess(username, email, password)
    }

    public async verify_email(otp_code: string) {
        switch (this.registrationHook) {
            case undefined: new Error(`No pending registration to verify`)
            default: return this.registrationHook?.verify_email(otp_code)
        }
    }

    public async resend_email() {
        switch (this.registrationHook) {
            case undefined: new Error(`No pending registration to verify`)
            default: return this.registrationHook?.resend_email()
        }
    }
}

