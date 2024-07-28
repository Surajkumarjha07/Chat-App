const express = require('express')
const { users } = require('./models')
const cors = require('cors')
const mongoose = require('mongoose')
const http = require('http')
const bodyParser = require('body-parser')
const socketIO = require('socket.io')
const SignUp = require('./routes/signUp')
const LogIn = require('./routes/signIn')
const Chat = require('./routes/chat')
const DeleteUser = require('./routes/delete')
const UpdateUser = require('./routes/update')

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

app.use('/signUp',SignUp)
app.use('/login',LogIn)
app.use('/chat',Chat)
app.use('/deleteUser',DeleteUser)
app.use('/updateUser',UpdateUser)

server.listen(4000, () => {
    console.log('Server is Running');
})