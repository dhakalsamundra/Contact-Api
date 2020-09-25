import sgMail from '@sendgrid/mail'
import bcrypt from 'bcryptjs'

import { BadRequestError, InternalServerError} from '../helpers/apiError'
import { SENDGRID_API_KEY, FROM_MAIL } from '../util/secrets'
import User from '../models/User'




export const passwordRequestReset = async(req, res)=> {
    try {
      const {email} = req.body
      console.log('reseet contro', email)

      const user = await User.findOne({email: email})
      console.log('reset contro', user)

      if (!user){
      return res.status(400).json({msg: 'This email is not associated. Please check your email address.'});
      }
      // generate and set the password reset token to the user database
      user.generatePasswordReset()
      await user.save()
      const link = `http://${req.headers.host}/api/resetPassword/${user.resetPasswordToken}`
      sgMail.setApiKey(SENDGRID_API_KEY)
      //send email
      const mailOptions = {
        to: user.email,
        from: FROM_MAIL,
        subject: 'password change request',
        text: `Hi ${user.name}, click on this link to reset the password.
        ${link}`,
      }
      console.log('This is information of sending mail', mailOptions)
      sgMail.setApiKey(SENDGRID_API_KEY)
      const sendMail = await sgMail.send(mailOptions)
      if (sendMail) {
        return res.json({ msg: 'Reset link has been sent to the provided email address.'})
      }
    } catch (error) {
      res.send(new BadRequestError('Invalid Request', error))
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
    User.findOne({resetPasswordToken: req.params.token, resetPasswordExpires: {$gt: Date.now()}})
        .then((user) => {
            if (!user) return res.status(401).json({message: 'Password reset token is invalid or has expired.'});

            // set the password in bcrypt
            const salt = bcrypt.genSaltSync(10)
            const hashed =  bcrypt.hashSync(req.body.password, salt)
            //Set the new password
            user.password = hashed;
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;

            // Save
            user.save((err) => {
                if (err) return res.status(500).json({message: err.message});

                sgMail.setApiKey(SENDGRID_API_KEY)
                // send email
                const mailOptions = {
                    to: user.email,
                    from: FROM_MAIL,
                    subject: "Your password has been changed",
                    text: `Hi ${user.name} \n 
                    This is a confirmation that the password for your account ${user.email} has just been changed.\n`
                };

                sgMail.send(mailOptions, (error, result) => {
                    if (error) return res.status(500).json({message: error.message});

                    res.status(200).json({message: 'Your password has been updated.'});
                });
            });
        });
  }
