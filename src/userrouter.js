const express = require('express')
const {User, attributes} = require("./usermodel")
const githubrequest = require('./github-api')
const { findOneAndUpdate, findOne } = require('./usermodel')

const router = new express.Router()


router.post('/adduser', async (req, res)=>{
    const username = req.query.username
    const url = '/users/' + username
    const userdetails = await githubrequest(url)
    console.log(typeof(userdetails.created_at))
    if (userdetails.message == 'Not Found') return res.status(404).send({error: "User not found"})
    const newuser = {
        username: userdetails.login,
        name: userdetails.name,
        location: userdetails.location,
        followercount: userdetails.followers,
        followingcount: userdetails.following,
        blog: userdetails.blog,
        bio: userdetails.bio,
        created_at: userdetails.created_at
    }
    const followinglist = await extractfollowing(username)
    newuser.followings = followinglist

    const followerlist = await extractfollower(username)
    newuser.followers = followerlist

    const friends = extractfriends(followerlist,followinglist)
    console.log(friends)
    newuser.friends = friends

    const user = new User(newuser)
    try {
    await user.save()
    res.send(user)
    } catch(e) {res.status(300).send({message: "User already exists"})}

})

router.get('/search', async (req,res)=>{
    const search = req.query.searchby
    const value = req.query.value
    let users
    try {
    if (search === 'username')
        users = await User.find({username:value})
    if (search === 'location'){
        const loc = decodeURIComponent(value)
        users = await User.find({location:loc})
    }
    if (search === 'name'){
        const fullname = decodeURIComponent(value)
        users = await User.find({name:fullname})
    }
    if (users.length == 0)
        return res.status(404).send({message: "No user found"})
    res.send(users)
} catch (e) {res.status(500)}

})

router.patch('/update', async (req, res)=>{
    const user = await User.findOne({username:req.query.username})
    if(!user) return res.status(404).send({message: "No user found"})

    const updates = Object.keys(req.body)
    const isValidOperation = updates.every((update)=> attributes.includes(update))
    if(!isValidOperation)    return res.status(400).send({ errmsg : "Invalid or unauthorised change"})

    updates.forEach((update) => {
        user[update] = req.body[update]
    })
    await user.save() 
    res.send(user)

})


router.get('/sort', async (req, res)=>{
    const sortby = req.query.sortby
    if (!attributes.includes(sortby)) res.status(303).send({message: 'Invalid sort request, please use valid sorting attribute'})
    var seq = req.query.seq
    if(seq !== 'asc' && seq != 'desc') seq = 'desc'
    try {
    const users = await User.find().sort({[sortby]: seq})
    res.send(users)
    } catch (e) {res.status(500)}
})

router.delete('/delete', async (req, res)=>{
    try {const username = req.query.username
    const user = await User.findOneAndDelete({username: username})
    if(!user)
        return res.status(404).send({message: "No user found"})
    res.send(user)
    } catch(e){res.status(500)}
})






//////////////////// methods used ////////////////////////////////
const extractfollower = async (username)=>{
    const followerdetails = await githubrequest('/users/'+username+'/followers')
    const followerlist = followerdetails.map((follower)=> follower.login)
    return followerlist
}

const extractfollowing = async (username)=>{
    const followingdetails = await githubrequest('/users/'+username+'/following')
    const followinglist = followingdetails.map((followed)=> followed.login)
    return followinglist
}

const extractfriends = (followers, followings) =>{
    var friendslist = []
    followers.forEach((follower)=>{
        followings.forEach((following)=>{
            if (follower === following){
                friendslist.push(follower)
            }
        })
    })
    return friendslist
}




module.exports = router