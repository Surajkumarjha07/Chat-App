const express = require('express')
const { users } = require('./models')
const cors = require('cors')
const mongoose = require('mongoose')
const http = require('http')
const jwt = require('jsonwebtoken')
const bodyParser = require('body-parser')
const socketIO = require('socket.io')


app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const corsOptions = {
    origin: 'http://localhost:3000',
    method: ["GET,POST,PUT,DELETE"],
    credentials: true
}

const server = http.createServer(app)
const io = socketIO(server, {
    cors: corsOptions
})

app.use(cors(corsOptions))

mongoose.connect("mongodb+srv://surajkumarjha771:MongoCompass@cluster0.eqrhtv8.mongodb.net/", {
    dbName: 'ChatApp'
}).then(() => {
    console.log('Database is Connected');
}).catch(() => {
    console.log('Error Connecting Database');
})

//Socket Connections

io.on('connection', (socket) => {
    socket.on('message', (sender, receiver, userMsg) => {
        io.emit('user-message', sender, receiver, userMsg)
        console.log('message arrived', sender, receiver, userMsg);
    })
})

app.get('/', (req, res) => {
    res.send('Hello Wayne')
})

app.post('/signUp', async (req, res) => {
    try {
        let { userInfo } = req.body;
        let { email, username, password } = userInfo
        let existingUser = await users.findOne({ email })
        let existingUsername = await users.findOne({ username })
        let NewUser = new users({ email, username, password })
        if (!existingUser && !existingUsername && email !== '' && password !== '' && username !== '') {
            await NewUser.save()
            res.status(200).json({
                message: 'User Created'
            })
        }
        else if (existingUser && email !== '' && password !== '' && username !== '') {
            res.status(409).json({
                message: 'User Already Exists'
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

app.post('/login', async (req, res) => {
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

app.get('/chat', async (req, res) => {
    let { fromUser,toUser,userMsg } = req.query;

    let allUsers = await users.find({})
    let receiver = await users.findOne({ email: toUser })
    let sender = await users.findOne({ email: fromUser })

    if (userMsg && fromUser && toUser) {
        
        receiver?.chats?.push({ sender: sender.email, receiver: receiver.email, userMsg: userMsg })
        sender?.chats?.push({ sender: sender.email, receiver: receiver.email, userMsg: userMsg })
    
        await receiver?.save()
        await sender?.save()

        let receiverChat = receiver? receiver.chats : null
        let senderChat = sender? sender.chats : null
        
        res.status(200).json({
            users: allUsers,
            userMsg,
            sender,
            receiver,
            receiverChat,
            senderChat
        })
    }
    else if (fromUser && toUser && userMsg === '') {
        let receiverChat = receiver? receiver.chats : null
        let senderChat = sender? sender.chats : null
        
        res.status(200).json({
            users: allUsers,
            receiverChat,
            senderChat
        })
    }

})

app.put('/updateUser', async (req, res) => {
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

app.delete('/deleteUser', async (req, res) => {
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


server.listen(4000, () => {
    console.log('Server is Running');
})