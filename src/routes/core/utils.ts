import { Dog } from "../../types/express/server";

export function dogUrlToDog(dogUrl: string): Dog {
    const returnDog: Dog = {
        name: "",
        imageUrl: dogUrl,
    };

    const urlRegex = /\/breeds\/(.*?)\//gi;
    const regexMatch = dogUrl.match(urlRegex);
    const dogName = regexMatch ? regexMatch[0] : "";

    returnDog.name = dogName.split("").slice(8, -1).join("");
    // "https://images.dog.ceo/breeds/briard/n02105251_6161.jpg"

    return returnDog;
}
