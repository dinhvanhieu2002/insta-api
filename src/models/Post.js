const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
    caption: {type: String },
    photo: {type: String },
    reactions: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    userId: 
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    
}, {
    timestamps: true
})


postSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
      }
})

module.exports = mongoose.model('Post', postSchema)