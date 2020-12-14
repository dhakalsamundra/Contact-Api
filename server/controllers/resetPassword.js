/* eslint-disable no-console */
import sgMail from '@sendgrid/mail'
import bcrypt from 'bcryptjs'
import { SENDGRID_API_KEY, FROM_MAIL } from '../util/secrets'
import User from '../models/User'

export const resetPasswordRequest= async(req, res) => {
  const { email } = req.body
  const { url } = req.body
  const user = await User.findOne({ email: email })
  if (!user) {
    return res.status(400).json({ msg: 'This email is not associated. Please check your email address.' })        }

  //generate and set the password reset token to the user database
  user.generatePasswordReset()
  user.save()

  const link = `${url}/${user.resetPasswordToken}`
  sgMail.setApiKey(SENDGRID_API_KEY)
  const mailOptions = {
    to: user.email,
    from: FROM_MAIL,
    subject: 'Link to reset password',
    html: `Link to reset your password and is valid for 1 hour only: <strong><a href=${link}>link</a></strong>`,
  }
  console.log(mailOptions)
  sgMail.setApiKey(SENDGRID_API_KEY)
  // const sendMail = sgMail.send(mailOptions)
  sgMail.send(mailOptions)
    .then(() => {
      console.log('Message Sent')
      return res.json({ msg: 'Reset link has been send to the provided email address.' })
    }) .catch(error => {
      console.error(error.response.body)
    })
}

export const resetPassword = async (req, res) => {
  const { token } = req.params
  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() },
  })
  if (!user) {
    return res.status(401).json('Password reset token is invalid or has expired.')
  }
  // set the new password in bcrypt
  const salt = bcrypt.genSaltSync(10)
  const hashed = await bcrypt.hashSync(req.body.password, salt)
  //set the new password in database
  user.password = hashed
  user.resetPasswordToken = undefined
  user.resetPasswordExpires = undefined
  user.save()
  sgMail.setApiKey(SENDGRID_API_KEY)
  const mailOptions = {
    to: user.email,
    from: FROM_MAIL,
    subject: 'New Password has been added.',
    text: `Hi ${user.name}, this is a confirmation mail of changing the password.`,
  }
  sgMail.setApiKey(SENDGRID_API_KEY)
  sgMail.send(mailOptions)
    .then(() => {
      console.log('Message Sent')
      return res.json({ msg: 'Now, Login with new password.' })
    }).catch (error => {
      res.json(error)
    })
}