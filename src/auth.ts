
import { Server, AuthKey, RegistrationHook, PasswordResetHook, AccountDeletionHook } from "./types.js"

export class Authenticator {
    constructor(
        public server: Server
    ) {}

    /*-----------------------------------------------------------------------------------\\
    ||                              ACCOUNT OPERATIONS                                   ||
    \\-----------------------------------------------------------------------------------*/

    public async loginWithGoogle(google_oauth_token: string) {
        const res = await fetch(`${this.server.api_url}/v1/auth/login/google`, {
            method: "POST",
            body: "Data sent as headers",
            headers: {
                "X-OAuth-Token": google_oauth_token,
                "Content-Type": "text/plain"
            }
        })
        switch (res.ok) {
            case true: return await res.json() as AuthKey
            default: throw new Error(`Login failed: ${res.status}`)
        }
    }

    public async loginWithMicroChess(username: string, password: string) {
        const res = await fetch(`${this.server.api_url}/v1/auth/login/native`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                "username": username,
                "password": password
            })
        })
        switch (res.ok) {
            case true: return await res.json() as AuthKey
            default: throw new Error(`Login failed: ${res.status}`)
        }
    }

    public async registerWithMicroChess(username: string, email: string, password: string) {
        const res = await fetch(`${this.server.api_url}/v1/auth/account-register/init`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                "email": email,
                "username": username,
                "password": password
            })
        })
        switch (res.ok) {
            case false: throw new Error(`Registration failed: ${res.status}`)
            default: return new RegistrationHook(
                async (otp_code: string) => await this.confirmRegistration(email, otp_code),
                async () => await this.resendRegistrationOtp(email)
            )
        }
    }

    public async resetPassword(email_or_password: string) {
        const res = await fetch(`${this.server.api_url}"/v1/auth/password-reset/init"`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                "identity": email_or_password
            })
        })
        switch (res.ok) {
            case false: throw new Error(`Password reset failed: ${res.status}`)
            default: return new PasswordResetHook(
                async (otp_code: string) => await this.confirmPasswordReset(email_or_password, otp_code),
                async () => await this.resendPasswordResetOtp(email_or_password)
            )
        }
    }

    public async deleteAccount(email_or_password: string) {
        const res = await fetch(`${this.server.api_url}/v1/auth/account-delete/init`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                "identity": email_or_password
            })
        })
        switch (res.ok) {
            case false: throw new Error(`Account deletion failed: ${res.status}`)
            default: return new AccountDeletionHook(
                async (otp_code: string) => await this.confirmAccountDeletion(email_or_password, otp_code),
                async () => await this.resendAccountDeletionOtp(email_or_password)
            )
        }
    }

    /*-----------------------------------------------------------------------------------\\
    ||                                RESEND / RETRY                                     ||
    \\-----------------------------------------------------------------------------------*/

    private async resendRegistrationOtp(email: string) {
        const res = await fetch(`${this.server.api_url}/v1/auth/account-register/retry`, {
            method:  "POST",
            headers: { "Content-Type": "application/json" },
            body:    JSON.stringify({ "email": email })
        })
        if (!res.ok) {
            throw new Error(`Resend email failed: ${res.status}`)
        }
    }

    private async resendAccountDeletionOtp(email: string) {
        const res = await fetch(`${this.server.api_url}/v1/auth/account-delete/retry`, {
            method:  "POST",
            headers: { "Content-Type": "application/json" },
            body:    JSON.stringify({ "email": email })
        })
        if (!res.ok) {
            throw new Error(`Resend email failed: ${res.status}`)
        }
    }

    private async resendPasswordResetOtp(email: string) {
        const res = await fetch(`${this.server.api_url}/v1/auth/password-reset/retry`, {
            method:  "POST",
            headers: { "Content-Type": "application/json" },
            body:    JSON.stringify({ "email": email })
        })
        if (!res.ok) {
            throw new Error(`Resend email failed: ${res.status}`)
        }
    }
    
    /*-----------------------------------------------------------------------------------\\
    ||                               OTP VERIFICATION                                    ||
    \\-----------------------------------------------------------------------------------*/

    private async confirmRegistration(email: string, otp_code: string) {
        const res = await fetch(`${this.server.api_url}/v1/auth/account-register/verify`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                "email": email,
                "otp": otp_code
            })
        })
        switch (res.ok) {
            case true: return await res.json() as AuthKey
            default: throw new Error(`Login failed: ${res.status}`)
        }
    }

    private async confirmPasswordReset(email: string, otp_code: string) {
        const res = await fetch(`${this.server.api_url}/v1/auth/password-reset/verify`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                "email": email,
                "otp": otp_code
            })
        })
        if (!res.ok) {
            throw new Error(`Login failed: ${res.status}`)
        }
    }

    private async confirmAccountDeletion(email: string, otp_code: string) {
        const res = await fetch(`${this.server.api_url}/v1/auth/account-delete/verify`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                "email": email,
                "otp": otp_code
            })
        })
        if (!res.ok) {
            throw new Error(`Login failed: ${res.status}`)
        }
    }
}

