import mongoose from "mongoose";


export const connectDb = async () => {
    return await mongoose.connect(process.env.CONNECTION_URL).then(() => {
        console.log("data base connection successfully ...");
    }).catch((err) => {
        console.log("fil to connection db! " , err);
       
    })
} 