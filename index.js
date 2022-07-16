const express = require("express")
const expres = require("./Routes/auth")
const app = express()

app.use(express.json())
app.use("/auth", expres)

app.get("/", (req, res) => {
    res.send("App working fine")
})

app.listen(4545)
