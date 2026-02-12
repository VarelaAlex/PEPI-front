import {useTranslation} from 'react-i18next';
import {useNavigate} from 'react-router-dom';
import ExerciseForm from './ExerciseFormComponent';

const CreateExercise = ({isMobile}) => {
    const {t} = useTranslation();
    const navigate = useNavigate();

    const handleSubmit = async (formData) => {
        const {
            title,
            language,
            category,
            networkType,
            definitionText,
            ampliationText,
            definitionPictogram,
            ampliationPictogram,
            mainImage,
            definitionImage,
            ampliationImages
        } = formData;

        let response = null;
        try {
            response = await fetch(`${process.env.REACT_APP_EXERCISES_SERVICE_URL}/exercises`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`
                },
                body: JSON.stringify({
                    title: title.toUpperCase(),
                    language: language[0],
                    category: category[0],
                    networkType: networkType[0],
                    representation: "MIXED",
                    mainImage: mainImage,
                    definitionText: definitionText ? definitionText.toUpperCase() : undefined,
                    definitionImage: definitionImage,
                    ampliationText: ampliationText?.length ? ampliationText.map(text => text.toUpperCase()) : undefined,
                    ampliationImages: ampliationImages,
                    definitionPictogram: definitionPictogram[0],
                    ampliationPictogram: ampliationPictogram[0]
                })
            });
        } catch (e) {
            return {error: {type: "internalServerError", message: e}};
        }

        const jsonData = await response?.json();
        if (response?.ok) {
            navigate("/teachers/manageExercises");
            return {success: true};
        } else {
            return {error: jsonData?.error};
        }
    };

    return (
        <ExerciseForm
            isMobile={isMobile}
            onSubmit={handleSubmit}
            title={t("exercise.create.title")}
            submitButtonText={t("exercise.create.addExercise.button")}
        />
    );
};

export default CreateExercise;