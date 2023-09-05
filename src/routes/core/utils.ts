import { Dog } from "../../types/express/server";

export function dogUrlToDog(dogUrl: string): Dog {
    const returnDog: Dog = {
        name: "",
        imageUrl: dogUrl,
    };

    const urlRegex = /\/breeds\/([a-z-]+)\//i;
    const regexMatch = dogUrl.match(urlRegex);
    const dogName = regexMatch ? regexMatch[1] : "";
    returnDog.name = dogName;

    return returnDog;
}
