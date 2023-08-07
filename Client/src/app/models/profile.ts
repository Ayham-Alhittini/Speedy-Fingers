export interface Profile {
    id: string;
    userName: string;
    memberSince: Date;
    keyboardLayout: string;
    typedWords: number;
    takenTests: number;
    competitionsTaken: number;
    competitionsWon: number;
    lowestWPM: number;
    sumWPM: number;
    highestWPM: number;
}