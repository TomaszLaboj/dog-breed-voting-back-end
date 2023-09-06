import { Pool } from "pg";
import express from "express";

type Express = ReturnType<typeof express>;

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

    app.get("/reset/database/", async (_req, res) => {
        try {
            const resetQuery = `DROP TABLE IF EXISTS breeds; 
            CREATE TABLE  breeds (breed_name  VARCHAR(255) PRIMARY KEY, votes INT NOT NULL DEFAULT 1); 
            INSERT INTO breeds (breed_name, votes) VALUES ('hound-afghan', 0), ('retriever-golden', 0), ('eskimo', 0);`;
            //For this to be successful, must connect to db
            await pool.query(resetQuery);
            res.status(200).send("database successfully reset");
        } catch (error) {
            //Recover from error rather than letting system halt
            console.error(error);
            res.status(500).send("An error occurred. Check server logs.");
        }
    });
}
