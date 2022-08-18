
// Entrypoint to the server
require('dotenv').config()
const express = require('express')


const app = express()
const PORT = process.env.PORT

const custodialRouter = require('./routes/custodial')
const accountRouter = require('./routes/accounts')
const flanRouter = require('./routes/flan')
app.use(express.json())
app.use('/accounts', accountRouter)
app.use('/flan', flanRouter)
app.use('/custodial', custodialRouter)

app.listen(PORT, () => {
  console.info(`App listening on http://0.0.0.0:${PORT}/`)
})