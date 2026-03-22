import { NextFunction, Request, Response } from "express";
import { AuthenticationError, ServerError, ValidationError } from "../errors/errors";

type FirebaseSignInSuccess = {
    idToken: string;
    email: string;
    localId: string;
    expiresIn: string;
    refreshToken: string;
};

type FirebaseErrorResponse = {
    error?: {
        message?: string;
    };
};

const INVALID_CREDENTIAL_ERRORS = new Set([
    "INVALID_PASSWORD",
    "EMAIL_NOT_FOUND",
    "INVALID_LOGIN_CREDENTIALS",
    "INVALID_EMAIL",
    "USER_DISABLED",
]);

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

    const firebaseApiKey = process.env.FIREBASE_WEB_API_KEY;

    if (!firebaseApiKey) {
        return next(
            new ServerError(
                "Server misconfiguration: FIREBASE_WEB_API_KEY is missing",
                "FIREBASE_API_KEY_MISSING"
            )
        );
    }

    try {
        const response = await fetch(
            `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${firebaseApiKey}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    password,
                    returnSecureToken: true,
                }),
            }
        );

        if (!response.ok) {
            const errorPayload = (await response.json()) as FirebaseErrorResponse;
            const firebaseMessage = errorPayload.error?.message ?? "INVALID_LOGIN_CREDENTIALS";

            if (INVALID_CREDENTIAL_ERRORS.has(firebaseMessage)) {
                return next(
                    new AuthenticationError(
                        "Unauthorized: Invalid email or password",
                        firebaseMessage
                    )
                );
            }

            return next(
                new AuthenticationError(
                    `Unauthorized: ${firebaseMessage}`,
                    firebaseMessage
                )
            );
        }

        const data = (await response.json()) as FirebaseSignInSuccess;

        res.status(200).json({
            idToken: data.idToken,
            email: data.email,
            localId: data.localId,
            expiresIn: data.expiresIn,
            refreshToken: data.refreshToken,
        });
    } catch (error) {
        return next(
            error instanceof Error
                ? new ServerError(
                      `Failed to sign in with Firebase: ${error.message}`,
                      "FIREBASE_SIGNIN_FAILED"
                  )
                : new ServerError(
                      "Failed to sign in with Firebase",
                      "FIREBASE_SIGNIN_FAILED"
                  )
        );
    }
};
