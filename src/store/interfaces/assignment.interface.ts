export interface IAssignment {
    grade: {
        percentage?: number | null,
        points: string,
    },
    markingPeriod: string,
    name: string,
    teacher: string,
    category: string,
    course: string,
    date: string,
    comment: string,
}