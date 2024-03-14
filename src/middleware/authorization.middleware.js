
export const isAuthorized = (role) => {
    return async (req, res, next) => {
        //check user role
        if (req.user.role !== role) return next(new Error("not Authorized", { cause: 403 }));

        return next()
    }
};