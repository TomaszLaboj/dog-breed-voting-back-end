import axios from "axios";
import {
    DbDog,
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

export async function dbDogToDogWithVotes(dbDog: DbDog): Promise<DogWithVotes> {
    const urlBreed = getRandomImageUrlByBreed(dbDog.breed_name);
    const response = await axios.get<DogApiRandomResponse>(urlBreed);
    const dogUrl = response.data.message as string;

    return { ...dbDog, imageUrl: dogUrl };
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
