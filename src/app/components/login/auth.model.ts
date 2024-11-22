export interface AuthResponse {
    success: boolean;
    token: string;
}

export interface DecodedToken {
    sub: string;
    userGuid: string;
    jti: string;
    exp: number;
    iss: string;
    aud: string;
}