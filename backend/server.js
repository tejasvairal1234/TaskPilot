import express from "express";
import dotenv from "dotenv";
import { connect } from "mongoose";

dotenv.config();
const app = express();

const port = process.env.PORT || 5000;

const server = async () =>
{
    try
    {
        // await connect();

        app.listen(port, () => 
        {
            console.log("Server is running on por ", port);
            console.log(`http://localhost:${port}`);
        })
    }
    catch(error)
    {
        console.log("Failed to start server...", error.message);
        process.exit(1);
    }
}

server();

