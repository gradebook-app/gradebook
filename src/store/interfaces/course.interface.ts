export interface ICourse {
    grade: {
        letter: string,
        percentage: number,
    },
    name: string,
    teacher: string,
    courseId: string,
    sectionId: string,
}