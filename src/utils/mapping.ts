import { ESchoolDistricts } from "../store/enums/school-districts.enum";

export const schoolDistrictsMapped : { [ Key in ESchoolDistricts ] : string } = {
    [ ESchoolDistricts.SOUTH_BRUNSWICK ]: "South Brunswick",
    [ ESchoolDistricts.MONTGOMERY_TOWNSHIP ]: "Montgomery Township",
};