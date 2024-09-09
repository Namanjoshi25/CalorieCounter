import mongoose from "mongoose";


export async function connect(){
    try {

       await mongoose.connect(process.env.MONGO_URL!);

        const connection = mongoose.connection;

        connection.on('connected',()=>{
            console.log("MongoDB connected successfully");
        })
        connection.on('error',(error)=>{
            console.log("MOngoDB connection error,Please make sure mongo db is running" + error);
        })
        
    } catch (error) {
        console.log("Error while connecting to the database");
        console.log(error);
    }
}