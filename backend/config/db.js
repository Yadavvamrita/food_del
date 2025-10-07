import mongoose from "mongoose"

 export const connectDB = async () =>{
    (await mongoose.connect('mongodb+srv://amritayadav:amritayadav@cluster0.46elzax.mongodb.net/food-del')).isObjectIdOrHexString(()=>console.log("DB Connected"));
}