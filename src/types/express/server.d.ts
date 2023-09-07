export interface Dog {
    breed_name: string;
    imageUrl: string;
}

export interface LeaderboardDog {
    breed_name: string;
    votes: number;
}

export interface DogWithVotes extends Dog {
    votes: number;
}

export interface DogApiRandomResponse {
    message: string[] | string;
    status: string;
}
