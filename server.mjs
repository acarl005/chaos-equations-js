import express from "express"

const app = express()
app.use('/chaos-equations-js', express.static('dist'))

const listener = app.listen(1234, () => {
  const port = listener.address().port
  console.log(`Listening at http://localhost:${port}/chaos-equations-js`)
})
