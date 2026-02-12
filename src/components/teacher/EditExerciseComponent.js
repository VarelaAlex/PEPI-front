import {useEffect, useState, useMemo} from 'react';
import {useTranslation} from 'react-i18next';
import {useNavigate, useParams} from 'react-router-dom';
import {Spin} from 'antd';
import ExerciseForm from './ExerciseFormComponent';

const EditExercise = ({isMobile}) => {
    const {t} = useTranslation();
    const navigate = useNavigate();
    const {exerciseId} = useParams();
    const [exercise, setExercise] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchExercise = async () => {
            try {
                const response = await fetch(
                    `${process.env.REACT_APP_EXERCISES_SERVICE_URL}/exercises/${exerciseId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("accessToken")}`
                        }
                    }
                );

                if (response.ok) {
                    const data = await response.json();
                    setExercise(data);
                } else {
                    navigate("/teachers/manageExercises");
                }
            } catch (e) {
                console.error("Error fetching exercise:", e);
                navigate("/teachers/manageExercises");
            } finally {
                setLoading(false);
            }
        };

        fetchExercise();
    }, [exerciseId, navigate]);

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
            response = await fetch(
                `${process.env.REACT_APP_EXERCISES_SERVICE_URL}/exercises/${exerciseId}`,
                {
                    method: "PUT",
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
                }
            );
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

    // Memoizar initialValues para evitar recrear el objeto en cada render
    const initialValues = useMemo(() => ({
        title: exercise?.title,
        language: exercise?.language,
        category: exercise?.category,
        networkType: exercise?.networkType,
        definitionText: exercise?.definitionText,
        ampliationText: exercise?.ampliationText || [],
        definitionPictogram: exercise?.definitionPictogram,
        ampliationPictogram: exercise?.ampliationPictogram,
        mainImage: exercise?.mainImage,
        definitionImage: exercise?.definitionImage,
        ampliationImages: exercise?.ampliationImages || []
    }), [exercise]);

    if (loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '50vh'
            }}>
                <Spin size="large"/>
            </div>
        );
    }

    return (
        <ExerciseForm
            isMobile={isMobile}
            initialValues={initialValues}
            onSubmit={handleSubmit}
            title={t("exercise.edit.title")}
            submitButtonText={t("exercise.edit.button")}
        />
    );
};

export default EditExercise;