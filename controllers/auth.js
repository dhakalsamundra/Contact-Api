import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import config from 'config'
import sgMail from '@sendgrid/mail'

import User from '../models/User'

export const findUserById = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
      } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
      }
}

export const signIn = async(req, res, next) => {
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
        config.get('jwtSecret'),
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

export const passwordRequestReset = async(req, res)=> {
  try {
    const { email } = req.body
    const user = await User.findOne({ email })
    console.log('this is the controller of auth babes', email)
    if (!user)
      return res.json({
        message:
          'This email is not associated. Please check your email address.',
      })
    // generate and set the password reset token to the user database
    user.generatePasswordReset()
    await user.save()
    const link = `http://${req.headers.host}/api/v1/auth/resetPasswordRequest/${user.resetPasswordToken}`
    sgMail.setApiKey(SENDGRID_API_KEY)
    //send email
    const mailOptions = {
      to: user.email,
      from: FROM_MAIL,
      subject: 'password change request',
      text: `Hi ${user.name}, click on this link to reset the password.
      ${link}`,
    }
    const sendMail = await sgMail.send(mailOptions)
    if (sendMail) {
      res.json({ message: 'Reset link has been sent to your email address.' })
    }
  } catch (error) {
    next(new Request('Invalid Request', error))
  }
}

export const resetPasswordTokenStatus = async(req, res) => {
  try {
    const { token } = req.params
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    })
    if (!user)
      return res
        .status(401)
        .json({ message: 'Password reset token is invalid or has expired.' })
    res.redirect(
      `http://localhost:3000/updatePassword/${user.resetPasswordToken}`
    )
  } catch (error) {
    res.send('password token is expired. so resend the new reset password.')
  }
}

export const resetPassword = async(req, res) => {
  try {
    const { token } = req.params
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    })
    if (!user) {
      throw new Error('Password reset token is invalid or has expired.')
    } else {
      // set the new password in bcrypt
      const salt = bcrypt.genSaltSync(10)
      const hashed = await bcrypt.hashSync(req.body.password, salt)
      //set the new password in database
      user.password = hashed
      user.resetPasswordToken = undefined
      user.resetPasswordExpires = undefined
    }
    user.save()
    const mailOptions = {
      to: user.email,
      from: FROM_MAIL,
      subject: 'New Password has been added.',
      text: `Hi ${user.name}, this is a confirmation mail of changing the password.`,
    }
    const sendMail = await sgMail.send(mailOptions)
    if (sendMail) {
      res.json({ message: 'Login with your new password now.' })
    }
  } catch (error) {
    res.json(error)
  }
}