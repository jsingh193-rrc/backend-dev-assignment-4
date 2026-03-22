// External library imports
import { Request, Response, NextFunction } from "express";

// Internal module imports
import { AuthorizationOptions } from "../models/authorizationOptions";
import { AuthorizationError } from "../errors/errors";

/**
 * Middleware to check if a user is authorized based on their role or UID.
 * Now integrated with centralized error handling system.
 *
 * This middleware:
 * - Checks if the user has required roles
 * - Optionally allows users to access their own resources
 * - Throws standardized AuthorizationError for access denied scenarios
 *
 * @param {AuthorizationOptions} opts - The authorization options.
 * @returns The middleware function.
 */
const isAuthorized = (opts: AuthorizationOptions) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            const { user, role: localRole, uid: localUid } = res.locals;
            const role = user?.role ?? localRole;
            const uid = user?.uid ?? localUid;
            const { id } = req.params;

            // Allow if the same user is accessing their own data
            if (opts.allowSameUser && id && uid === id) {
                return next();
            }

            // If no role exists on the user, throw Forbidden response
            if (!role) {
                throw new AuthorizationError(
                    "Forbidden: No role found",
                    "ROLE_NOT_FOUND"
                );
            }

            // Check if the user's role matches one of the allowed roles
            if (opts.hasRole.includes(role)) {
                return next();
            }

            // If the role is not authorized, throw Forbidden response
            throw new AuthorizationError(
                "Forbidden: Insufficient role",
                "INSUFFICIENT_ROLE"
            );
        } catch (error: unknown) {
            // Pass errors to the centralized error handler
            if (error instanceof AuthorizationError) {
                return next(error);
            }

            return next(
                new AuthorizationError(
                    "Forbidden: Access denied",
                    "ACCESS_DENIED"
                )
            );
        }
    };
};

export default isAuthorized;