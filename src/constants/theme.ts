
import { DynamicColorIOS, OpaqueColorValue } from "react-native";

export interface ITheme {
    palette: {
        primary: string,
        secondary: string,
    },
    theme: {
        background: OpaqueColorValue | any,
        secondary: OpaqueColorValue | any,
        icon: OpaqueColorValue | any,
        text: OpaqueColorValue | any,
        grey: OpaqueColorValue | any,
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

const dynamicBackgroundColor = DynamicColorIOS({
    light: "#fff",
    dark: "#000",
  });
  
const dynamicSecondaryColor = DynamicColorIOS({
light: "#fff",
dark: "#111111",
});

const dynamicTextColor = DynamicColorIOS({
light: "#000",
dark: "#fff",
});

const dynamicGreyColor = DynamicColorIOS({
light: "rgba(0, 0, 0, 0.5)",
dark: "rgba(255, 255, 255, 0.5)",
});

const dynamicIconColor = DynamicColorIOS({
light: "rgba(0, 0, 0, 0.15)",
dark: "rgba(255, 255, 255, 0.35)",
});

const themePalette = {
    background: dynamicBackgroundColor,
    secondary: dynamicSecondaryColor,
    icon: dynamicIconColor,
    text: dynamicTextColor,
    grey: dynamicGreyColor
};

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
}

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
}

const theme:ITheme = {
    palette: {
        primary: '#a2d2ff',
        secondary: '#43A4FF',
    }, 
    theme:themePalette,
    gradeColors,
    categoryColors,
};

export { theme };