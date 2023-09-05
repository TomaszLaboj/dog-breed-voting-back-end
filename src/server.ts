import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { Pool } from "pg";
import { getEnvVarOrFail } from "./support/envVarUtils";
import { setupDBClientConfig } from "./support/setupDBClientConfig";
import { getDogRoutes } from "./routes/dogs";
import { getGeneralRoutes } from "./routes/general";

dotenv.config(); //Read .env file lines as though they were env vars.

const dbClientConfig = setupDBClientConfig();
const pool = new Pool(dbClientConfig);

//Configure express routes
const app = express();

app.use(express.json()); //add JSON body parser to each following route handler
app.use(cors()); //add CORS support to each following route handler


getGeneralRoutes(pool, app);
getDogRoutes(pool, app);


connectToDBAndStartListening();
// console.log(pool)

async function connectToDBAndStartListening() {
    console.log("Attempting to connect to db");
    await pool.connect();
    console.log("Connected to db!");

    const port = getEnvVarOrFail("PORT");
    app.listen(port, () => {
        console.log(
            `Server started listening for HTTP requests on port ${port}.  Let's go!`
        );
    });
}
