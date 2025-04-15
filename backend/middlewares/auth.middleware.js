
export const protectRoute = async (req, res, next) => {
    const accessToken = req.cookies.accessToken;

    if (!accessToken) {
        return res.status(401).json({ message: "Access token missing" });
    }

    // Attach token to request for next middleware
    req.accessToken = accessToken;
    
    next();
};
