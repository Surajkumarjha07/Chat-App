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

router.get('/', async (req,res) => {
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

module.exports = router