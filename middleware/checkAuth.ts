import { NextFunction, Request, Response } from "express";

/*
FIX ME (types) 😭
*/
export const ensureAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/auth/login");
};

/*
FIX ME (types) 😭
*/
export const forwardAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.isAuthenticated()) {
    return next();
  }
  res.redirect("/dashboard");
};

// function isAdmin(req: Request, res: Response, next: NextFunction): void {
//   if (req.isAuthenticated() && req.user && req.user.role === "Admin") {
//     return next();
//   } else {
//     res.status(403).send("Unauthorized");
//   }
// }
