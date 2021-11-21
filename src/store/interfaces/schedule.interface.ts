export interface IScheduleCourse {
    period: string,
    startTime: string,
    endTime: string,
    name: string,
    teacher: string,
    room: string,
}

export interface ISchedule {
    header?: string,
    courses?: IScheduleCourse[]
}