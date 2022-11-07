const express = require('express');
const cors = require('cors');
const app = express()
const port = process.env.PORT || 5000
require('dotenv').config()

/* Middleware */
app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.send('Hey developer i am calling from review server (: ')
})
app.listen(port, () => {
    console.log('Server running on this port', port)
})