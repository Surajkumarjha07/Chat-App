const express = require('express')
const {UserSchema, users} = require('../models')
const router = express.Router();
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

router.post('/', async (req, res) => {
    try {
        let { email, username, password } = req.body
        let existingUserEmail = await users.findOne({ email })
        let existingUsername = await users.findOne({ username })
        let NewUser = new users({ email, username, password})
        if (!existingUserEmail && !existingUsername && email !== '' && password !== '' && username !== '') {
            await NewUser.save()
            res.status(200).json({
                message: 'User Created'
            })
        }
        else if (existingUserEmail && email !== '' && password !== '' && username !== '') {
            res.status(409).json({
                message: 'Email already in use'
            })
        }
        else if (existingUsername && email !== '' && password !== '' && username !== '') {
            res.status(410).json({
                message: 'Username already in use'
            })
        }
        else {
            res.status(400).json({
                message: 'Enter Details Correctly'
            })
        }
    } catch (error) {
        console.log('User not saved', error);
    }
})

module.exports = router