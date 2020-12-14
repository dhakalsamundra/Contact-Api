/* eslint-disable no-console */
import express from 'express'
import path from 'path'
import mongoose from 'mongoose'
import compression from 'compression'
import bodyParser from 'body-parser'
import cors from 'cors'
import authRouter from './routers/auth'
import userRouter from './routers/user'
import contactRouter from './routers/contact'
import resetRouter from './routers/password'
import { MONGODB_URI } from './util/secrets'

import '@babel/polyfill'


const app = express()
app.use(cors())
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  next()
})

const mongoUrl = MONGODB_URI
mongoose
  .connect(mongoUrl, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    /** ready to use. The `mongoose.connect()` promise resolves to undefined. */
  })
  .catch((err) => {
    console.log(
      'MongoDB connection error. Please make sure MongoDB is running. ' + err
    )
    process.exit(1)
  })
app.set('port', process.env.PORT || 3002)

app.use(express.json({ extended: false }))

app.use(express.static(path.join(__dirname, '../client/build')))
app.use(compression())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use('/api/users', userRouter)
app.use('/api/auth', authRouter)
app.use('/api/contacts', contactRouter)
app.use('/api/resetPassword', resetRouter)

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('../client/build'))

  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, '../client', 'build', 'index.html'))
  )
}



export default app
