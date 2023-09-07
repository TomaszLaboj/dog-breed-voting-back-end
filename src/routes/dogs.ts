import axios from "axios";
import express from "express";
import { Pool } from "pg";
import {
    areDogsInvalidOrEqual,
    dogUrlToDog,
    getRandomImageUrlByBreed,
} from "../core/utils";
import { DogApiRandomResponse } from "../types/express/server";

type Express = ReturnType<typeof express>;

export function getDogRoutes(_pool: Pool, app: Express) {
    app.get("/dogs", async (_req, res) => {
        try {
            let dogs = [];
            do {
                const response = await axios.get<DogApiRandomResponse>(
                    "https://dog.ceo/api/breeds/image/random/2"
                );
                const dogUrls = response.data.message as string[];
                dogs = dogUrls.map(dogUrlToDog);
            } while (await areDogsInvalidOrEqual(dogs[0], dogs[1]));
            res.status(200).json(dogs);
        } catch (error) {
            console.error(error);
            res.status(500).send("An error occurred. Check server logs.");
        }
    });

    app.get<{ breed_name: string }>("/dogs/:breed_name", async (req, res) => {
        const urlBreed = getRandomImageUrlByBreed(req.params.breed_name);

        try {
            const response = await axios.get<DogApiRandomResponse>(urlBreed);
            const dogUrl = response.data.message as string;
            const dog = dogUrlToDog(dogUrl);
            res.status(200).json(dog);
        } catch (error) {
            console.error(error);
            res.status(500).send("An error occurred. Check server logs.");
        }
    });
}
