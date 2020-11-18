const mongoose = require('mongoose')

const sauceSchema = mongoose.Schema({
    id: ObjectID,
    userId: { type: String },
    name: { type: String },
    manufacturer: { type: String },
    description: { type: String },
    mainPepper: { type: String },
    imageUrl: { type: String },
    heat: { type: Number },
    likes: { type: Number },
    dislikes: { type: Number },
    usersLiked: { type: [String] },
    usersDisliked: { type: [String] }
})

model.exports = mongoose.model('Sauce', sauceSchema)