
export type Color = 
    "white" | "black";

export class User {
    constructor(
        public id: string,
        public username: string,
        public authenticated: boolean
    ) {}
}

export class Player {
    constructor(
        public user: User,
        public color: Color
    ) {}
}

export class Board {
    constructor(
        public fen: string
    ) {}
}

export class Clock {
    constructor(
        public white_starting_time: number,
        public black_starting_time: number,
        public white_time_treshold: number,
        public black_time_treshold: number,
    ) {}
}

export class Game {
    constructor(
        public myself: Player,
        public opponent: Player,
        public board: Board,
        public clock: Clock
    ) {}
}

export class Server {
    constructor(
        public api_url: string = "http://localhost:80"
    ) {}
}

export class AuthKey {
    constructor(
        public id: string,
        public username: string,
        public email: string,
        public token: string
    ) {}
}

export class RegistrationHook {
    constructor(
        public verify_email: (otp_code: string) => Promise<AuthKey>,
        public resend_email: () => Promise<void>,
    ) {}
}