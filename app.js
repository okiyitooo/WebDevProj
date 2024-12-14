require('dotenv').config()
const path = require('path')
const cors = require('cors')
const express = require('express')
const mongoose = require('mongoose')
const app = express();

const PORT = process.env.PORT;
app.use(cors())
app.use(express.json())

mongoose.connect(process.env.MONGO_DB_URI)
app.use('*',(req,res) =>{
    res.sendFile(path.join(__dirname+'/index.html'))
})
const UserSchema = new mongoose.Schema({
    //firstname
    firstName:{type: String, required:true},
    //lastName
    lastName:{type: String, required:true},
    //age
    age:{type: Number, required:true},
    //sex
    sex:{type: String, required:true},
    //phoneNumber
    phoneNumber:{type: String, required:true},
    //email
    email:{type: String, required:true,unique:true},
})

const User =  mongoose.model("User",UserSchema)

const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    version: { type: String, required: true },
    description: { type: String, required: true }
});

const Product = mongoose.model('Product', ProductSchema);
// get all users
app.get('/users', async(req, res)=>{
    try {
        const users = await User.find() //=>|
                                        //  v
        res.status(200).json(users)
    } catch(err){
        res.status(500).json({message: err.message})
    }
})
// get a single user
app.get('/users/id/:id',(req,res)=>{
    //https://www.your-website.com/users/id/:id
    try {
        const user = User.findById(req.params.id)
        // if is null |  if it's undefined | if its zero |  if its false
        if (!user) return res.status(404).json({message:"User is not found"})
            
    } catch(err){
        res.status(500).json({message: err.message})
    }
})
app.post('/users',async (req,res)=>{
    const newUser = new User(req.body)
    try{
        const savedUser = await newUser.save()
        res.status(201).json(savedUser)
    }
    catch(err){
        res.status(400).json({message:err.message})
    }
})

// make get and post requests for products


app.listen(PORT, ()=>{
    console.log(`Server listening to ${PORT}`)
})