const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
    },
    followers: [{                   // use concat/push to add data
        type: String,
    }],
    followercount: {
        type: Number
    },
    followings: [{
        type: String,
    }],
    followingcount: {
        type: Number
    },
    friends: [{
        type: String,
    }],
    location: {

    },
    blog: {
        type: String
    },
    bio: {
        type: String
    },
    created_at: {
        type: String
    }
})


userSchema.methods.toJSON = function() {
    const user = this
    const userObj = this.toObject()
    delete userObj.followers
    delete userObj.followings

    return userObj
}

const User = mongoose.model("User", userSchema)

var attributes = []
userSchema.eachPath((path)=>{
    attributes.push(path)
})
attributes.pop()
attributes.pop()


module.exports = {
    User,
    attributes
}