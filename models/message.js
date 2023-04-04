const mongoose = require('mongoose')
const Schema = mongoose.Schema

const messageSchema = Schema({
    friendship: {
        type: mongoose.Types.ObjectId,
        ref: 'Friendship'
    },
    sender: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },
    receiver: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },
    body: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('Message', messageSchema)