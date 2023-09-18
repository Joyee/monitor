const express = require('express')
const app = express()
const cors = require('cors')

app.use(cors())

app.use(express.static('public'))

app.post('/track', function (req, res) {
  res.send('POST request to the homepage')
})

app.listen(3300, () => {
  console.log('server started at 3300')
})
