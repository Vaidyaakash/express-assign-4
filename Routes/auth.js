const expres = require("express").Router()
const { users } = require("../users")
const bcrypt = require("bcrypt")
const jwtToken = require('jsonwebtoken')
const { check, validationResult } = require("express-validator")

expres.post("/signup", [
    check("email", "please provide a valid mail").isEmail(),
    check("password", "plz provide valid password greater than 5 charachter").isLength({
        min: 6,
    })
],
    async function (req, res) {
        const { email, password } = req.body
        const err = validationResult(req)
        if (!err.isEmpty()) {
            return res.status(400).json({
                err: err.array()
            });
        }
        //validating whether the user is exist or not 
        let user = users.find((user) => {
            return user.email == email;
        })
        if (user) {
            return res.status(400).json({
                "errors": [{
                    "message": "this user is already exists"
                }]
            })
        }
        const hashedPwd = await bcrypt.hash(password, 10)
        console.log(hashedPwd);
        users.push({
            email,
            password: hashedPwd
        })
        const token = await jwtToken.sign({ email }, "qowiytwiru", { expiresIn: 36000 })
        res.json({ token })
        // console.log(email,password)
        // res.send("Auth is working")
    })
exp.post('/login', async (req, res) => {
    const { email, password } = req.body
    let user = users.find((user) => {
        return user.email === email;

    })
    if (!user) {
        return res.status(400).json({
            "errors": [{
                "message": "invalid credential,plz try to signup"
            }]
        })
    }
    let match = await bcrypt.compare(password, user.password)
    if (!match) {
        return res.status(400).json({
            "errors": [{
                "message": "invalid credential "
            }]
        })
    }
    const token = await jwtToken.sign({ email }, "qowiytwiru", { expiresIn: 36000 })
    res.json({ token })

});
exp.get("/data", (req, res) => {
    res.json(users)
})
module.exports = expres;