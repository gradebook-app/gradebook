export interface IUser {
    _id: any | string,
    notificationToken: string,
    studentId?: string; 
    unweightedGPA?: number; 
    weightedGPA?: number; 
    gpaHistory?: {
        _id: string,
        userId: string,
        unweightedGPA: number,
        weightedGPA: number
        timestamp: number,
    }[],
    schoolDistrict: string,
}