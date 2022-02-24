export interface IThemeStatic {
    palette: {
        primary: string,
        secondary: string,
        blue: string; 
    },
    gradeColors: {
        a: string,
        aMinus: string,
        bPlus: string,
        b:string,
        cPlus: string,
        c: string,
        dPlus: string,
        d: string,
        f: string
    },
    categoryColors: {
        test:string,
        quiz:string,
        homework:string,
        classwork:string,
        seminar:string,
        project: string,
        research:string,
        essay:string,
        default:string,
    }
}
const gradeColors = {
    a: "#009B0E",
    aMinus: "#009B0E",
    bPlus: "#B69800",
    b: "#B69800",
    cPlus: "#B69800",
    c: "#B69800",
    dPlus: "#9B6E00",
    d: "#9B6E00",
    f: "#CE0000"
};

const categoryColors = {
    test: "#C500F0",
    quiz: "#FF69E1",
    homework: "#04AFFF",
    classwork: "#00AD10",
    seminar: "#5284FF",
    project: "#FF5279",
    research: "#FF9104",
    essay: "#002774",
    default: "#FAC51E",
};

const theme:IThemeStatic = {
    palette: {
        primary: "#a2d2ff",
        secondary: "#43A4FF",
        blue: "#147EFB"
    }, 
    gradeColors,
    categoryColors,
};

export { theme };