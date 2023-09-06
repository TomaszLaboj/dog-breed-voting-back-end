import { Pool } from "pg";
import express from "express";
import axios from "axios";
import { DogApiRandomResponse } from "../types/express/server";
import { dogUrlToDog } from "../core/utils";

type Express = ReturnType<typeof express>;

export function getDogRoutes(_pool: Pool, app: Express) {
    // app.get("/dogs/", async (_req, res) => {
    //     const query = "";
    //     const values = []
    //     try {
    //         const response = await pool.query(query, values);
    //         const data = response.rows;
    //         res.status(200).json(data);
    //     } catch (error) {
    //         console.error(error);
    //         res.status(500).send("An error occurred. Check server logs.");
    //     }
    // });

    app.get("/dogs", async (_req, res) => {
        try {
            let dogs = [];
            do {
                const response = axios.get<DogApiRandomResponse>(
                    "https://dog.ceo/api/breeds/image/random/2"
                );
                const dogUrls = (await response).data.message;
                dogs = dogUrls.map(dogUrlToDog);
            } while (dogs[0].name === dogs[1].name);
            res.status(200).json(dogs);
        } catch (error) {
            console.error(error);
            res.status(500).send("An error occurred. Check server logs.");
        }
    });
}
