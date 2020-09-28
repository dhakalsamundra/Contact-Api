import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import config from 'config'
import {JWT_SECRET} from '../util/secrets'
import User from '../models/User'

const jwtSecret = JWT_SECRET
export const findUserById = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
      } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
      }
}

export const signIn = async(req, res) => {
    try {
      const {email, password} = req.body;
      let user = await User.findOne({email});

      if (!user) {
        return res.status(400).json({msg: 'Invalid Credentials'});
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({msg: 'Invalid Credentials'});
      }

      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        jwtSecret,
        {
          expiresIn: 360000,
        },
        (err, token) => {
          if (err) throw err;
          res.json({token});
        },
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
