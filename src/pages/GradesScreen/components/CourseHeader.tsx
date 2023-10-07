import React from "react";
import SaveBanner from "../../../components/SaveBanner";
import GPASlideshow from "./GPASlideshow";
import BannerAd from "../../../components/BannerAd";
import { IGPAPast } from "../../../hooks/usePastGPA";
import { IGPA } from "../../../hooks/useGPA";

interface ICourseHeaderProps {
    navigation: any; 
    gpa: IGPA; 
    pastGPA: IGPAPast[];   
}

const CourseHeader : React.FC<ICourseHeaderProps> = ({ navigation, gpa, pastGPA }) => {
    const handleDonateScreen = () => {
        navigation.navigate("donate");
    };

    const handleGPAScreen = () => {
        navigation.navigate("gpa");
    };

    return (
        <>
            <GPASlideshow handleGPAScreen={handleGPAScreen} pastGPA={pastGPA} gpa={gpa} />
            <BannerAd style={{ marginTop: 15 }} />
            <SaveBanner onPress={handleDonateScreen} />
        </>
    );
};

export default React.memo(CourseHeader);