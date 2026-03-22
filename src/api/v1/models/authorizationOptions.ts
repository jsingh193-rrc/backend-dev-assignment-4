export type Role = "officer" | "manager" | "admin";

export interface AuthorizationOptions {
    hasRole: Role[];
    allowSameUser?: boolean;
}
