const express = require('express')
const {UserSchema, users} = require('../models')
const router = express.Router();
const cors = require('cors')

app = express()
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cors())

router.post('/signUp', async (req, res) => {
    try {
        let { email, password, confirmPassword } = req.body;
        let existingUser = await users.findOne({email})
        let NewUser = new users({email,password})
        if (!existingUser && email !== '' && password !== '' && confirmPassword !== '' && password === confirmPassword) {
            await NewUser.save()
            res.status(200).json({
                message: 'User Created'
            })
        }
        else if (existingUser && email !== '' && password !== '' && confirmPassword !== '' && password === confirmPassword) {
            res.status(409).json({
                message: 'User Already Exists'
            })
        }
        else{
            res.status(400).json({
                message: 'Enter Details Correctly!'
            })
        }
    } catch (error) {
        console.log('User not saved', error);
    }
})

module.exports = router