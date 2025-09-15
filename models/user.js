import mongoose from 'mongoose';
import { Schema } from 'mongoose';
import passportLocalMongoose from 'passport-local-mongoose';

const userSchema = new Schema({
    email:{
        type:String,
        required:true,
        unique:true,
    }
    //P-l-m -- will take care of other fields(read doc);
},{timestamps:true});


userSchema.plugin(passportLocalMongoose);


export const User = mongoose.model("User", userSchema);
