import { useMemo } from "react";
import { useTheme } from "../hooks/useTheme";

export const useGradeColor = (percent:number) => {
    const { gradeColors } : any = useTheme();

    const gradeColor = useMemo(() => {
        if (percent >= 93) {
            return gradeColors.a;
        } else if (percent < 93 && percent >= 90) {
            return gradeColors.aMinus;
        } else if (percent < 90 && percent >= 80) {
            return gradeColors.b;
        } else if (percent < 80 && percent >= 70) {
            return gradeColors.c;
        } else if (percent < 70 && percent > 60) {
            return gradeColors.d;
        } else if (percent < 60 && percent > 0) {
            return gradeColors.f;
        } else {
            return "grey";
        }

    }, [ percent ]);

    return gradeColor; 
};
