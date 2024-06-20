import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { buildApiResponse } from "../utils/Response";

// Define the middleware function for authentication
export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res
        .status(403)
        .send(
          buildApiResponse(false, 403, "Authentication token not provided")
        );
    }

    jwt.verify(
      token,
      process.env.TOKEN_SECRET as string,
      (err: any, decoded: any) => {
        if (err) {
          return res
            .status(403)
            .send(buildApiResponse(false, 403, "Invalid token"));
        }

        // Assuming 'decoded' contains the necessary user information
        // if (req.user) {
        req.user = {
          username: decoded.v_username,
          nama: decoded.nama,
          access: decoded.access,
          id: decoded.id,
          unit_kerja_id: decoded.unit_kerja_id,
          role: decoded.role,
          // Add other properties if needed
        };
        // }

        // Call next middleware
        next();
      }
    );
  } catch (error) {
    console.error(error);
    res.status(500).send(buildApiResponse(false, 500, "Internal Server Error"));
  }
};
