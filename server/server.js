import express from 'express'

const PORT = 8080
const app = express()

app.get('/', (req, res) => {
    // do stuff
})

app.listen(PORT, () => {
    console.log(`server running on ${PORT}`)
})