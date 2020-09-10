const expresss = require('express');

const app = express()

const PORT = process.env.PORT || 3001

app.listen(PORT, ()=> console.log(`Server is running in port ${PORRT}`))