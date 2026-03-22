import { NextFunction, Request, Response } from "express";
import { AuthenticationError, ValidationError } from "../errors/errors";

type MockUser = {
    email: string;
    localId: string;
    role: "officer" | "manager" | "admin";
};

const MOCK_PASSWORD = "password123";

const MOCK_USERS: MockUser[] = [
    {
        email: "officer@pixell-river.com",
        localId: "officer-uid-001",
        role: "officer",
    },
    {
        email: "manager@pixell-river.com",
        localId: "manager-uid-001",
        role: "manager",
    },
    {
        email: "admin@pixell-river.com",
        localId: "admin-uid-001",
        role: "admin",
    },
];

export const signIn = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    const { email, password } = req.body as {
        email?: string;
        password?: string;
    };

    if (!email || !password) {
        return next(
            new ValidationError(
                "Email and password are required",
                "MISSING_CREDENTIALS"
            )
        );
    }

    const mockUser = MOCK_USERS.find((user) => user.email === email);

    if (!mockUser || password !== MOCK_PASSWORD) {
        return next(
            new AuthenticationError(
                "Unauthorized: Invalid email or password",
                "INVALID_LOGIN_CREDENTIALS"
            )
        );
    }

    res.status(200).json({
        idToken: `${mockUser.role}-token-abc123`,
        email: mockUser.email,
        localId: mockUser.localId,
        expiresIn: "3600",
        refreshToken: `${mockUser.role}-refresh-token`,
    });
};
