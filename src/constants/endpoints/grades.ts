export const queryGrades= (markingPeriod:string) => `grades?markingPeriod=${markingPeriod}`;
export const queryCourseWeight = (courseId:string, sectionId:string) => (
    `/grades/weight?courseId=${courseId}&sectionId=${sectionId}`
);
export const SET_COURSE_WEIGHT = "grades/weight";
export const GET_GPA = "grades/gpa";
export const GET_PAST_GPA = "grades/pastGPA";