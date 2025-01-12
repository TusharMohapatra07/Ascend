import {Schema, model} from "mongoose"

const userSchema = new Schema({
    email:{type:String, require:true},
    name:{type: String, require:true},
    imageUrl:{type:String, require:true},
    socials:[String],
    location: {type:String},
    bio:{type:String},
    followers:{type:Number},
    following:{type:Number},
    Achiverments:[String],
    Organizations:[String],
})

const skillSchmea = new Schema({
    content: Schema.Types.Mixed,
    email:String // Use Mixed for flexible data types
})

export const User = model('User', userSchema)
export const Sill = model('Skill', skillSchmea)
