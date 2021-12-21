import { useMemo } from "react";
import { useTheme } from "../hooks/useTheme";

export const useLetterColor = (letter:string) : null | string => {
    const { gradeColors } : any = useTheme();

    const letterColor = useMemo(() => {
        if (!letter || !letter as any instanceof String) return null;

        if (letter == "A" || letter == "A+") {
            return gradeColors.a;
        } else if (letter == "A-") {
            return gradeColors.aMinus;
        } else if (letter == "B" || letter == "B+" || letter == "B-") {
            return gradeColors.b;
        } else if (letter == "C" || letter == "C+" || letter == "C-") {
            return gradeColors.c;
        } else if (letter == "D" || letter == "D+" || letter == "D-") {
            return gradeColors.d;
        } else if (letter == "F" || letter == "F+" || letter == "F-") {
            return gradeColors.f;
        } else {
            return null;
        }

    }, [ letter ]);

    return letterColor; 
};
