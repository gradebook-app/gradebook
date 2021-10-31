export const queryAssignments = (courseId:string, sectionId:string, markingPeriod:string) => (
    `/grades/assignments?courseId=${courseId}&sectionId=${sectionId}&markingPeriod=${markingPeriod}`
);