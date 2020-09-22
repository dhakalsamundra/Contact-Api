import express from 'express'
import mongoose from 'mongoose'
import path from 'path'
import apiContentType from './middleware/apiContentType'
import authJwt from './middleware/auth'
import { MONGODB_URI } from './util/secrets'
import authRouter from './routers/auth'
import userRouter from './routers/user'
import contactRouter from './routers/contact'
import unless from './util/unless'


const app = express()


const mongoUrl = MONGODB_URI

mongoose
  .connect(mongoUrl, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('MongoDB Connected...');
})
  .catch((err) => {
    console.log(
      'MongoDB connection error. Please make sure MongoDB is running. ' + err
    )
    process.exit(1)
  })
  
//  const excludedPaths = [ /users/]

// middlewares
app.use(express.json({ extended: false }));
// app.use('/api',apiContentType, unless(excludedPaths, authJwt))

// use router
app.use('/api/users', userRouter)
app.use('/api/auth', authRouter)
app.use('/api/contacts', contactRouter)

if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('client/build'));

  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
  );
}

// const PORT =  process.env.PORT || 3002
// app.listen(PORT, () => console.log(`Server started on port ${PORT}`),
// console.log('  Press CTRL-C to stop\n'));

const PORT = process.env.PORT || 3002;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));