// External library imports
import { Request, Response, NextFunction } from "express";
import { DecodedIdToken } from "firebase-admin/auth";
import { AuthenticationError } from "../errors/errors";

// Internal module imports
import { auth } from "../../../config/firebaseConfig";

type FirebaseLikeError = Error & { code?: string };

const toAuthenticationError = (error: unknown): AuthenticationError => {
    if (!(error instanceof Error)) {
        return new AuthenticationError(
            "Unauthorized: Invalid token",
            "TOKEN_INVALID"
        );
    }

    const firebaseError = error as FirebaseLikeError;
    const code = firebaseError.code ?? "";

    if (code === "auth/id-token-expired") {
        return new AuthenticationError(
            "Unauthorized: Token expired",
            "TOKEN_EXPIRED"
        );
    }

    if (
        code === "auth/invalid-id-token" ||
        code === "auth/argument-error" ||
        code === "auth/id-token-revoked"
    ) {
        return new AuthenticationError(
            "Unauthorized: Invalid token",
            "TOKEN_INVALID"
        );
    }

    return new AuthenticationError(
        `Unauthorized: ${error.message}`,
        code || "TOKEN_INVALID"
    );
};

/**
 * Middleware to authenticate a user using a Firebase ID token.
 * Now integrated with centralized error handling system.
 *
 * This middleware:
 * - Extracts the token from the Authorization header
 * - Verifies the token with Firebase Auth
 * - Stores user information in res.locals for downstream middleware
 * - Throws standardized AuthenticationError for any failures
 *
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @param {NextFunction} next - The next middleware function.
 * @returns {Promise<void>}
 */
const authenticate = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const authHeader = req.headers.authorization;
        const hasBearerPrefix = authHeader?.startsWith("Bearer ");
        const token: string | undefined = hasBearerPrefix
            ? authHeader.split(" ")[1]
            : undefined;

        if (!authHeader || !hasBearerPrefix || !token) {
            throw new AuthenticationError(
                "Unauthorized: No token provided",
                "TOKEN_NOT_FOUND"
            );
        }

        const decodedToken: DecodedIdToken = await auth.verifyIdToken(token);
        const role = (decodedToken as { role?: string }).role;

        // Attach user context for downstream middleware and handlers
        res.locals.user = {
            uid: decodedToken.uid,
            role,
            email: decodedToken.email,
        };

        // Backward-compatible fields used by existing middleware
        res.locals.uid = decodedToken.uid;
        res.locals.role = role;
        next();
    } catch (error: unknown) {
        if (error instanceof AuthenticationError) {
            return next(error);
        }

        return next(toAuthenticationError(error));
    }
};

export default authenticate;
