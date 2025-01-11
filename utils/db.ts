import {Schema, model} from "mongoose"

const userSchema = new Schema({
    email:{type:String, require:true},
    name:{type: String, require:true},
    imageUrl:{type:String, require:true},
    socials:[String]
})

const skillSchmea = new Schema({
    name:{type:String, require:true},
    imageUrl:{type:String, require:true},
})