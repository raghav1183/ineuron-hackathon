const express = require("express")
const app = express()
const port = 3000
const fs = require("fs")
const path = require("path")
app.use(express.static(path.join(__dirname,"/")))

app.get("/",(req,res)=>res.send("Baby ye to chal gaya! <emoji>:love</emoji>"))
app.get("/health",(req,res)=>
    fs.readFile("frontend/html/index.html",
    "utf8",
    function (err,text){
        res.send(text)
    })
)


app.listen(port,()=>console.log("Server started!!!! \n \delay10s yippie! maza aaaaa gaya"))
