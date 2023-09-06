import { Pool } from "pg";
import express from "express";

type Express = ReturnType<typeof express>;

export function getLeaderboardRoutes(pool: Pool, app: Express) {


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
