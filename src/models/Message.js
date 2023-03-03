const mongoose = require('mongoose')

const messageSchema = new mongoose.Schema({
    conversationId: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Conversation'
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    text: { type: String }
}, {
    timestamps: true
})


messageSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
      }
})

module.exports = mongoose.model('Message', messageSchema)