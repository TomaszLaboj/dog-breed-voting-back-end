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

    app.get("/reset/database", async (_req, res) => {
        try {
            const resetQuery = `DROP TABLE IF EXISTS breeds; 
            CREATE TABLE  breeds (breed_name  VARCHAR(255) PRIMARY KEY, votes INT NOT NULL DEFAULT 0); 
            INSERT INTO breeds (breed_name) VALUES ('hound-afghan'), ('retriever-golden'), ('eskimo');`;
            //For this to be successful, must connect to db
            await pool.query(resetQuery);
            res.status(200).send("database successfully reset");
        } catch (error) {
            //Recover from error rather than letting system halt
            console.error(error);
            res.status(500).send("An error occurred. Check server logs.");
        }
    });

    app.get("/leaderboard", async (_req, res) => {
        try {
            const leaderboardQuery =
                "SELECT * FROM breeds ORDER BY votes DESC LIMIT 10";
            //For this to be successful, must connect to db
            const response = await pool.query(leaderboardQuery);
            const data = response.rows;
            res.status(200).json(data);
        } catch (error) {
            //Recover from error rather than letting system halt
            console.error(error);
            res.status(500).send("An error occurred. Check server logs.");
        }
    });

    app.put("/vote/:breed", async (req, res) => {
        try {
            const addVote =
                "INSERT INTO breeds (breed_name) VALUES ($1) ON CONFLICT (breed_name) DO UPDATE SET votes=breeds.votes+1 WHERE breeds.breed_name = $1 RETURNING *";
            const breedName = req.params.breed;
            //For this to be successful, must connect to db
            const respone = await pool.query(addVote, [breedName]);
            const updatedRow = respone.rows;
            res.status(200).json(updatedRow);
        } catch (error) {
            //Recover from error rather than letting system halt
            console.error(error);
            res.status(500).send("An error occurred. Check server logs.");
        }
    });
}
