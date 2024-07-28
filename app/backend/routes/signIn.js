const express = require('express')
const {UserSchema, users} = require('../models')
const router = express.Router();
const jwt = require('jsonwebtoken')
const cors = require('cors')

app = express()
app.use(express.json())
app.use(express.urlencoded({extended: true}))

const corsOptions = {
    origin: 'http://localhost:3000',
    method: ["GET,POST,PUT,DELETE"],
    credentials: true
}

app.use(cors(corsOptions))

router.post('/', async (req,res) => {
    try {
        let userData = req.body;
        let { email, password } = userData;
        let existingUser = await users.findOne({ email })

        if (existingUser && password !== '' && email !== '') {
            if (existingUser.password === password) {
                const token = jwt.sign({ email, password }, 'chattingapplication', { expiresIn: '1min' })
                res.status(200).json({
                    message: 'User found',
                    token,
                    existingUser,
                })
            }
            else if (existingUser.password !== password && email !== '') {
                res.status(401).json({
                    message: 'Invalid User or Password'
                })
            }
        }
        else if (!existingUser && password !== '') {
            res.status(404).json({
                message: 'User not found'
            })
        }
        else {
            res.status(400).json({
                message: 'Enter Details Correctly'
            })
        }
    } catch (error) {
        console.log(error);
    }
})

module.exports = router