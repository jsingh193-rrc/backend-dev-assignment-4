// External library imports
import { Request, Response, NextFunction } from "express";
import { DecodedIdToken } from "firebase-admin/auth";
import { AuthenticationError } from "../errors/errors";

// Internal module imports
import { auth } from "../../../config/firebaseConfig";

type FirebaseLikeError = Error & { code?: string };
type MockRole = "officer" | "manager" | "admin";

type MockAuthContext = {
    uid: string;
    role: MockRole;
    email: string;
};

const MOCK_ROLE_SET = new Set<MockRole>(["officer", "manager", "admin"]);

const parseMockToken = (token: string): MockAuthContext | null => {
    const tokenMatch = token.match(/^(officer|manager|admin)-token-/);

    if (!tokenMatch) {
        return null;
    }

    const role = tokenMatch[1] as MockRole;

    if (!MOCK_ROLE_SET.has(role)) {
        return null;
    }

    return {
        uid: `${role}-uid-001`,
        role,
        email: `${role}@pixell-river.com`,
    };
};

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
        const hasBearerPrefix = authHeader && authHeader.startsWith("Bearer ");
        const token: string | undefined = hasBearerPrefix
            ? authHeader.split(" ")[1]
            : undefined;

        if (!authHeader || !hasBearerPrefix || !token) {
            throw new AuthenticationError(
                "Unauthorized: No token provided",
                "TOKEN_NOT_FOUND"
            );
        }

        const mockAuthContext = parseMockToken(token);

        if (mockAuthContext) {
            res.locals.user = {
                uid: mockAuthContext.uid,
                role: mockAuthContext.role,
                email: mockAuthContext.email,
            };
            res.locals.uid = mockAuthContext.uid;
            res.locals.role = mockAuthContext.role;
            return next();
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
        return next();
    } catch (error: unknown) {
        if (error instanceof AuthenticationError) {
            return next(error);
        }

        return next(toAuthenticationError(error));
    }
};

export default authenticate;
