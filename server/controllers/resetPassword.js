import sgMail from '@sendgrid/mail'
import bcrypt from 'bcryptjs'
import { SENDGRID_API_KEY, FROM_MAIL } from '../util/secrets'
import User from '../models/User'

 export const resetPasswordRequest= async(req, res) => {
    const {email} = req.body
    const {url} = req.body
    const user = await User.findOne({ email: email })
        if (!user) {
          return res.status(400).json({msg: 'This email is not associated. Please check your email address.'});        }
        
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
        .then(()=> {
          console.log('Message Sent')
          return res.json({msg: 'Reset link has been send to the provided email address.'})
        }) .catch(error=> {
          console.error(error.response.body)
        })
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
            console.log(hashed)

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
                console.log(mailOptions)
                sgMail.send(mailOptions, (error, result) => {
                    if (error) return res.status(500).json({message: error.message});

                    res.status(200).json({message: 'Your password has been updated.'});
                });
            })
        }).catch(error =>{
          console.error(error)
        })
  }