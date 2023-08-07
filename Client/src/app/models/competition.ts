import { CompetitionRank } from "./competitionRank";

export interface Competition
{
    id: number,
    users: CompetitionRank[],
    words: string[],
    date: Date,
    testsTaken: number,
    time: {hours: number, minutes: number, seconds: number}
}