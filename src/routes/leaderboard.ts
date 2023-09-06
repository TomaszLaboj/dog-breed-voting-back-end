import express from "express";
import { Pool } from "pg";
import { checkValidBreed, dbDogToDogWithVotes } from "../core/utils";

type Express = ReturnType<typeof express>;

// CLEAR CODE
export function getLeaderboardRoutes(pool: Pool, app: Express) {
    app.get("/leaderboard", async (_req, res) => {
        try {
            const query_leaderboard =
                "SELECT * FROM breeds ORDER BY votes DESC LIMIT 10";
            const response = await pool.query(query_leaderboard);
            const dbDogs = response.rows;
            res.status(200).json(dbDogs);
        } catch (error) {
            console.error(error);
            res.status(500).send("An error occurred. Check server logs.");
        }
    });

    // CLEAR CODE
    app.get<{ top_nb: string }>("/leaderboard/:top_nb", async (req, res) => {
        try {
            const query_leaderboard =
                "SELECT * FROM breeds ORDER BY votes DESC LIMIT $1";
            const response = await pool.query(query_leaderboard, [
                req.params.top_nb,
            ]);
            const topDbDogs = response.rows;
            const topDogsWithVotes = await Promise.all(
                topDbDogs.map((oneDog) => dbDogToDogWithVotes(oneDog))
            );

            res.status(200).json(topDogsWithVotes);
        } catch (error) {
            console.error(error);
            res.status(500).send("An error occurred. Check server logs.");
        }
    });

    // CLEAR CODE
    app.put("/vote/:breed_name", async (req, res) => {
        try {
            await checkValidBreed(req.params.breed_name);
            const query_addVote =
                "INSERT INTO breeds (breed_name) VALUES ($1) ON CONFLICT (breed_name) DO UPDATE SET votes=breeds.votes+1 WHERE breeds.breed_name = $1 RETURNING *";
            const breedName = req.params.breed_name;

            const response = await pool.query(query_addVote, [breedName]);
            const updatedRow = response.rows;
            res.status(200).json(updatedRow);
        } catch (error) {
            console.error(error);
            res.status(500).send("An error occurred. Check server logs.");
        }
    });
}
