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

router.delete('/', async (req,res) => {
    try {
        let { password, userEmail } = req.body
        let user = await users.findOne({ email: userEmail })

        if (password) {
            if (password === user?.password) {
                await users.deleteOne(user)
                res.status(200).json({
                    message: 'user deleted successfully'
                })
            }
            else if (password !== user?.password) {
                res.status(401).json({
                    message: 'Invalid Password'
                })
            }
        }
        else {
            res.status(400).json({
                message: 'Enter Credentials Correctly'
            })
        }
    } catch (error) {
        console.log(error);
    }
})

module.exports = router