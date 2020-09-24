import config from 'config'
import sgMail from '@sendgrid/mail'

import { BadRequestError} from '../helpers/apiError'
import User from '../models/User'



const sendGridApiKey = config.get('SENDGRID_API_KEY')
const fromMail = config.get('FROM_MAIL')

export const passwordRequestReset = async(req, res)=> {
    try {
      const {email} = req.body

      const user = await User.findOne({email: email})

      if (!user){
      return res.status(400).json({msg: 'This email is not associated. Please check your email address.'});
      }
      // generate and set the password reset token to the user database
      user.generatePasswordReset()
      await user.save()
      const link = `http://${req.headers.host}/api/resetPassword/${user.resetPasswordToken}`
      sgMail.setApiKey(sendGridApiKey)
      //send email
      const mailOptions = {
        to: user.email,
        from: fromMail,
        subject: 'password change request',
        text: `Hi ${user.name}, click on this link to reset the password.
        ${link}`,
      }
      console.log('This is information of sending mail', mailOptions)
      const sendMail = await sgMail.send(mailOptions)
      if (sendMail) {
        res.json({ message: 'Reset link has been sent to your email address.' })
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
    try {
      const { token } = req.params
      const {password} = req.body
      console.log('first step backend reset', token)
      const user = await User.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() },
      })
      console.log('2nd step backend reset', user)
      if (!user) {
        throw new NotFoundError('Password reset token is invalid or has expired.')
      }else {
        // set the new password in bcrypt
        const salt = bcrypt.genSaltSync(10)
        console.log('fasdnfsangnrsg', req.body.password)
        const hashed = await bcrypt.hashSync(req.body.password, salt)
        //set the new password in database
        user.password = hashed
        user.resetPasswordToken = undefined
        user.resetPasswordExpires = undefined
      }
      user.save()
      console.log('final step', user)
      sgMail.setApiKey(sendGridApiKey)
      const mailOptions = {
        to: user.email,
        from: fromMail,
        subject: 'Password reset Confirmation.',
        text: `Hi ${user.name}, Your Password was successfully changed.`,
      }
      console.log('send confirm mail', mailOptions)
      const sendMail = await sgMail.send(mailOptions)
      if (sendMail) {
        res.json({ message: 'Login with your new password now.' })
      }
    } catch (error) {
      res.json(error)
    }
  }