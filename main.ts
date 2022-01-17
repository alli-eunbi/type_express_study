import express from "express"

const app = express()

app.get("/", (req, res) => {
    res.send("Hello World!")
})

app.get("/corona", (req, res) => {
    res.send("Hello corona!")
})

app.listen(3000, ()=> {
    console.log("server is started")
})