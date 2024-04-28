import {Schema, model} from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
const UserSchema = new Schema({
   name:{
    type:String,
    required:true,

   },
   email:{
    type:String,
    required:true,
    unique:true,
    trim:true,
   },
   password:{
    type:String,
    required:true,
   },
   refreshToken:{
      type:String
   }

});


UserSchema.pre("save", async function (next) {
   if (!this.isModified("password")) {
     return next();
   }
   this.password = await bcrypt.hash(this.password, 10);
 
     // Add this to generate and save the refresh token
     if (!this.refreshToken) { 
       this.refreshToken = await this.generateRefreshToken();
     }
   
     next();
 });

 UserSchema.methods.isPasswordCorrect = async function (password) {
   return await bcrypt.compare(password, this.password);
 };
 
 UserSchema.methods.generateAccessToken = async function () {
  return jwt.sign(
     {
       _id: this._id,
       email: this.email
     },
     process.env.ACCESS_TOKEN_SECRET,
     { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
   );
 };
 UserSchema.methods.generateRefreshToken = async function () {
  return jwt.sign(
     {
       _id: this._id,
     },
     process.env.REFRESH_TOKEN_SECRET,
     { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
   );
 };
 

const User = model('User', UserSchema);

export default User;