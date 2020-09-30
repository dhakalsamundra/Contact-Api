import express from 'express'
import path from 'path'
import mongoose from 'mongoose'

import authRouter from './routers/auth'
import userRouter from './routers/user'
import contactRouter from './routers/contact'
import resetRouter from './routers/password'
import { MONGODB_URI } from './util/secrets'
import '@babel/polyfill'


const app = express()
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

app.use(express.json({ extended: false }));

app.use(express.static(path.join(__dirname, '../client/build')));

app.use('/api/users', userRouter)
app.use('/api/auth', authRouter)
app.use('/api/contacts', contactRouter)
app.use('/api/resetPassword', resetRouter)

app.get('*', (req, res) => {
    res.send(express.static(path.join(__dirname, '../client/build/index.html')))  ;
 });



export default app;
