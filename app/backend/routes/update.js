const express = require('express')
const {UserSchema, users} = require('../models')
const router = express.Router();
const cors = require('cors');

app = express()
app.use(express.json())
app.use(express.urlencoded({extended: true}))

const corsOptions = {
    origin: 'http://localhost:3000',
    method: ["GET,POST,PUT,DELETE"],
    credentials: true
}

app.use(cors(corsOptions))

router.put('/', async (req,res) => {
    try {
        let { userEmail, updatedEmail, updatedUsername, currentPassword, newPassword } = req.body
        let user = await users.findOne({ email: userEmail })
        let existingEmail = await users.findOne({ email: updatedEmail })
        let existingUsername = await users.findOne({ username: updatedUsername })


        let updatedUserData = {
            $set: {
                email: updatedEmail,
                username: updatedUsername,
                password: newPassword
            }
        }

        if (updatedEmail && updatedUsername && currentPassword && newPassword) {
            if (currentPassword === user?.password && !existingEmail && !existingUsername) {

                let result = await users.updateOne(user, updatedUserData)
                res.status(200).json({
                    message: 'User updated',
                    result
                })
            }
            else if (existingEmail) {
                res.status(402).json({
                    message: 'Email already in use'
                })
            }
            else if (existingUsername) {
                res.status(403).json({
                    message: 'Username already in use'
                })
            }
            else if (currentPassword !== user?.password) {
                res.status(401).json({
                    message: 'Enter correct password'
                })
            }
        }
        else {
            res.status(400).json({
                message: 'Enter Details Correctly'
            })
        }
    } catch (error) {
        res.status(500).json({
            message: 'Internal Server Error'
        })
    }
})

module.exports = router