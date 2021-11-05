export interface IUser {
    _id: string,
    notificationToken: string,
    gpaHistory?: {
        _id: string,
        userId: string,
        unweightedGPA: number,
        weightedGPA: number
        timestamp: number,
    }[],
    schoolDistrict: string,
}