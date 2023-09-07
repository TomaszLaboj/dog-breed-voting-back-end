import axios from "axios";
import {
    LeaderboardDog,
    Dog,
    DogApiRandomResponse,
    DogWithVotes,
} from "../types/express/server";

export function dogUrlToDog(dogUrl: string): Dog {
    const returnDog: Dog = {
        breed_name: "",
        imageUrl: dogUrl,
    };

    const urlRegex = /\/breeds\/([a-z-]+)\//i;
    const regexMatch = dogUrl.match(urlRegex);
    const dogName = regexMatch ? regexMatch[1] : "";
    returnDog.breed_name = dogName;

    return returnDog;
}

export async function leaderboardDogToDogWithVotes(
    leaderboardDog: LeaderboardDog
): Promise<DogWithVotes> {
    const urlBreed = getRandomImageUrlByBreed(leaderboardDog.breed_name);
    const response = await axios.get<DogApiRandomResponse>(urlBreed);
    const dogUrl = response.data.message as string;

    return { ...leaderboardDog, imageUrl: dogUrl };
}

export function getRandomImageUrlByBreed(breed_name: string): string {
    const urlBreedName = breed_name.replace("-", "/");

    return `https://dog.ceo/api/breed/${urlBreedName}/images/random`;
}

export async function checkValidBreed(breed_name: string): Promise<void> {
    const breedValidatyResponse = await axios.get<DogApiRandomResponse>(
        getRandomImageUrlByBreed(breed_name)
    );

    if (breedValidatyResponse.data.status === "error") {
        throw new Error("Invalid dog breed");
    }
}

export async function isRequestInvalid(url: string): Promise<boolean> {
    try {
        await axios.get(url);
    } catch (error) {
        return true;
    }

    return false;
}

export async function areDogsInvalidOrEqual(firstDog: Dog, secondDog: Dog) {
    return (
        firstDog.breed_name === secondDog.breed_name ||
        (await isRequestInvalid(firstDog.imageUrl)) ||
        (await isRequestInvalid(secondDog.imageUrl))
    );
}
