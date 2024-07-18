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
    socket.on('message', (msg, toEmail, fromEmail) => {
        io.emit('user-message', msg, toEmail, fromEmail)
        console.log('message arrived', msg, toEmail, fromEmail);
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
        let { email, password } = req.body;
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
    let allUsers = await users.find({})


    res.status(200).json({
        users: allUsers
    })

})


server.listen(4000, () => {
    console.log('Server is Running');
})