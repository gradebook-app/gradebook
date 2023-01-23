import { ESchoolDistricts } from "../store/enums/school-districts.enum";
import { ECourseWeight } from "../store/enums/weights";

export const schoolDistrictsMapped : { [ Key in ESchoolDistricts ] : string } = {
    [ ESchoolDistricts.SOUTH_BRUNSWICK ]: "South Brunswick",
    [ ESchoolDistricts.MONTGOMERY_TOWNSHIP ]: "Montgomery Township",
};

export const courseWeightMapped : { [ Key in ECourseWeight ] : string } = {
    [ ECourseWeight.AP ]: "AP Weighted",
    [ ECourseWeight.HONORS ]: "Honors Weighted",
    [ ECourseWeight.UNWEIGHTED ]: "Unweighted",
}

export const courseWeightMappedColors : { [ Key in ECourseWeight ] : string[] } = {
    [ ECourseWeight.AP ]: [ '#c471ed', '#f64f59' ],
    [ ECourseWeight.HONORS ]: [ '#8e44ad', '#c0392b' ],
    [ ECourseWeight.UNWEIGHTED ]: [ '#d53369', '#cbad6d' ],
}