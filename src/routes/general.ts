import { Pool } from "pg";
import express from "express";

type Express = ReturnType<typeof express>

export function getGeneralRoutes(pool: Pool, app: Express) {


    app.get("/", async (_req, res) => {
        res.json({ msg: "Hello! There's nothing interesting for GET /" });
    });
    
    app.get("/health-check", async (_req, res) => {
        try {
            //For this to be successful, must connect to db
            await pool.query("select now()");
            res.status(200).send("system ok");
        } catch (error) {
            //Recover from error rather than letting system halt
            console.error(error);
            res.status(500).send("An error occurred. Check server logs.");
        }
    });
    

}

