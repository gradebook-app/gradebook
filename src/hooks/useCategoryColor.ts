import { useMemo } from "react";
import { useTheme } from "./useTheme";

export const useCategoryColor = (category:string) => {
    const { categoryColors } = useTheme();

    const categoryColor = useMemo(() => {
        const string = category.toLowerCase();

        if (string.includes("test")) {
            return categoryColors.test
        } else if (string.includes("classwork")) {
            return categoryColors.classwork
        } else if (string.includes("project")) {
            return categoryColors.project
        } else if (string.includes("homework")) {
            return categoryColors.homework
        } else if (string.includes("research")) {
            return categoryColors.research
        } else if (string.includes("essay")) {
            return categoryColors.essay
        } else if (string.includes("quiz")) {
            return categoryColors.quiz
        }  else if (string.includes("seminar")) {
            return categoryColors.seminar
        } else {
            return categoryColors.default
        }

    }, [ category ]);

    return categoryColor; 
}
