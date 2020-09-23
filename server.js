import express from 'express'
import path from 'path'
import authRouter from './routers/auth'
import userRouter from './routers/user'
import contactRouter from './routers/contact'
import connectDB from './config/db'


const app = express()
connectDB();


//  const excludedPaths = [ /users/]

// middlewares
app.use(express.json({ extended: false }));
// app.use('/api',apiContentType, unless(excludedPaths, authJwt))

// use router
app.use('/api/users', userRouter)
app.use('/api/auth', authRouter)
app.use('/api/contacts', contactRouter)

// serve statis assets in production
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