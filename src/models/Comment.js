const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema({
    postId: { type: String },
    reactions: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    caption: { type: String },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
}, {
    timestamps: true
})


commentSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
      }
})

module.exports = mongoose.model('Comment', commentSchema)