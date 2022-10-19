const express = require("express")
require("../db/mongoose")
var githubrequest = require('./github-api')
const userRouter = require('./userrouter')

const app = express()
const port = process.env.PORT

app.use(express.json())
app.use(userRouter)

app.get('/test', async () =>{
   const url = '/users/' + 'AshishARN'
   const text = await githubrequest(url)
   console.log(text)
})

app.listen(port, ()=> {
    console.log("Server is up on port 4000")
})






