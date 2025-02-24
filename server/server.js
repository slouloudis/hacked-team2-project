import express from "express"
import cors from "cors"
import pg from "pg"

const app = express()


const db = new pg.Pool({
    connectionString: process.env.DB_URL
})
// middleware 

app.use(express.json())
app.use(cors())

// for our routes
app.get('/hazards', async (req, res) => {
    // req.body
    // req.params
    // 
    const info = await db.query(`HELLO`)

    res.status(200).json({})
       

})

app.listen(8080, () => {console.log('running')})                                       