import jwt from 'jsonwebtoken'

import {JWT_SECRET} from '../util/secrets'

const jwtSecret = JWT_SECRET
export default async function authJwt(req, res, next) {
   // Get token from header
   const token = req.header('x-auth-token');

   // Check if not token
   if (!token) {
     return res.status(401).json({ msg: 'No token, authorization denied' });
   }
 
   try {
     const decoded = jwt.verify(token, jwtSecret);
 
     req.user = decoded.user;
     next();
   } catch (err) {
     res.status(401).json({ msg: 'Token is not valid' });
   }
}
