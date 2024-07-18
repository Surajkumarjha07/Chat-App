const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true
    },

    username: {
        type: String,
        unique: true,
        required: true
    },

    password: {
        type: String,
        required: true
    },

    chats: [{
        type: String,
    }]
})

const users = mongoose.model('users', UserSchema)

module.exports = { UserSchema, users }