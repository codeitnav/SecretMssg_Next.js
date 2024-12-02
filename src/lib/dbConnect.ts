import mongoose from "mongoose";

type ConnectionObject = {
    isConnected?: number
}
// ? tells that "isConnected" value is optional but if got, it'll be in number format only

const connection: ConnectionObject = {} // "connection" variable is able to set to null object only bec "ConnectionObject" - its type - is optional

// since we don't mind what the type of data is in return from database, so <void> is used - this does not mean empty like in cpp 
async function dbConnect(): Promise<void>{

    // safety/optimization check
    if(connection.isConnected){
        console.log("Already connected to database");
        return
    }

    try {
        const db = await mongoose.connect(process.env.MONGODB_URI || '', {})

        // db.connections gave an array in which we extracted the 1st element
        connection.isConnected = db.connections[0].readyState

        console.log("DB connected successfully");

    } catch (error) {
        console.log("Database connection failed", error);

        process.exit(1)
    }
}

export default dbConnect;