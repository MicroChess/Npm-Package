
import { Server, AuthKey, RegistrationHook } from "./types.js"

export class Authenticator {
    constructor(
        public server: Server
    ) {}

    public async loginWithGoogle(google_oauth_token: string) {
        const res = await fetch(`${this.server.api_url}/v1/auth/google/login`, {
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
        const res = await fetch(`${this.server.api_url}/v1/auth/native/login`, {
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
        const res = await fetch(`${this.server.api_url}/v1/auth/native/register/init`, {
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
                async (otp_code: string) => await this.verify_email(email, otp_code),
                async () => await this.resend_email(email)
            )
        }
    }

    private async verify_email(email: string, otp_code: string) {
        const res = await fetch(`${this.server.api_url}/v1/auth/native/register/verify`, {
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

    private async resend_email(email: string) {
        const res = await fetch(`${this.server.api_url}/v1/auth/google/register/retry`, {
            method:  "POST",
            headers: { "Content-Type": "application/json" },
            body:    JSON.stringify({ "email": email })
        })
        if (!res.ok) {
            throw new Error(`Resend email failed: ${res.status}`)
        }
    }
}

