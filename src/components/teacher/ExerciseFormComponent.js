import {Alert, Button, Card, Cascader, Form, Image, Input} from 'antd';
import {useMemo, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {CATEGORIES} from '../../Globals';
import SelectImageModal from './SelectImageModalComponent';
import i18n from "../../i18n";

const ExerciseForm = ({
                          isMobile,
                          initialValues = {},
                          onSubmit,
                          submitButtonText,
                          title
                      }) => {
    const {t} = useTranslation();
    const lng = i18n.language;
    const [message, setMessage] = useState(null);
    const [openMain, setOpenMain] = useState(false);
    const [openDefinition, setOpenDefinition] = useState(false);
    const [openAmpliation, setOpenAmpliation] = useState(false);

    // Inicializar estados solo una vez basándose en initialValues
    const [selectedMainImages, setSelectedMainImages] = useState(() =>
        initialValues?.mainImage ? [initialValues.mainImage] : []
    );
    const [selectedDefinitionImages, setSelectedDefinitionImages] = useState(() =>
        initialValues?.definitionImage ? [initialValues.definitionImage] : []
    );
    const [selectedAmpliationImages, setSelectedAmpliationImages] = useState(() =>
        initialValues?.ampliationImages || []
    );
    const [networkType, setNetworkType] = useState(() =>
        initialValues?.networkType || null
    );
    const [selectedLanguage, setSelectedLanguage] = useState(() =>
        initialValues?.language || lng.split("-")[0]
    );

    const [form] = Form.useForm();

    const networkTypeOptions = [
        {key: "I-I", value: 'I-I', label: 'I-I', fields: 1},
        {key: "I-II", value: 'I-II', label: 'I-II', fields: 2},
        {key: "I-III", value: 'I-III', label: 'I-III', fields: 3}
    ];

    const categoryOptions = Object.values(CATEGORIES).map(category => ({
        key: category,
        value: category?.toUpperCase(),
        label: t(`categories.${category.toLowerCase()}`, {lng: selectedLanguage})
    }));

    const languageOptions = [
        {value: 'es', label: 'Español'},
        {value: 'en', label: 'English'}
    ];

    const definitionPictogramOptions = [
        {
            value: 'is',
            label: <><Image alt={t("pictograms.is", {lng: selectedLanguage})} preview={false} width={20}
                            src='/pictograms/is.png'/> {t("pictograms.is", {lng: selectedLanguage})}</>
        },
        {
            value: 'isFor',
            label: <><Image alt={t("pictograms.isFor", {lng: selectedLanguage})} preview={false} width={20}
                            src='/pictograms/isFor.png'/> {t("pictograms.isFor", {lng: selectedLanguage})}</>
        },
        {
            value: 'isPartOf',
            label: <><Image alt={t("pictograms.isPartOf", {lng: selectedLanguage})} preview={false} width={20}
                            src='/pictograms/isPartOf.png'/> {t("pictograms.isPartOf", {lng: selectedLanguage})}</>
        },
        {
            value: 'are',
            label: <><Image alt={t("pictograms.are", {lng: selectedLanguage})} preview={false} width={20}
                            src='/pictograms/are.png'/> {t("pictograms.are", {lng: selectedLanguage})}</>
        },
        {
            value: 'areFor',
            label: <><Image alt={t("pictograms.areFor", {lng: selectedLanguage})} preview={false} width={20}
                            src='/pictograms/areFor.png'/> {t("pictograms.areFor", {lng: selectedLanguage})}</>
        },
        {
            value: 'arePartOf',
            label: <><Image alt={t("pictograms.arePartOf", {lng: selectedLanguage})} preview={false} width={20}
                            src='/pictograms/arePartOf.png'/> {t("pictograms.arePartOf", {lng: selectedLanguage})}</>
        }
    ];

    const ampliationPictogramOptions = [
        {
            value: 'has',
            label: <><Image alt={t("pictograms.has", {lng: selectedLanguage})} preview={false} width={20}
                            src='/pictograms/has.png'/> {t("pictograms.has", {lng: selectedLanguage})}</>
        },
        {
            value: 'isUsedFor',
            label: <><Image alt={t("pictograms.isUsedFor", {lng: selectedLanguage})} preview={false} width={20}
                            src='/pictograms/isUsedFor.png'/> {t("pictograms.isUsedFor", {lng: selectedLanguage})}</>
        },
        {
            value: 'isIn',
            label: <><Image alt={t("pictograms.isIn", {lng: selectedLanguage})} preview={false} width={20}
                            src='/pictograms/isIn.png'/> {t("pictograms.isIn", {lng: selectedLanguage})}</>
        },
        {
            value: 'have',
            label: <><Image alt={t("pictograms.have", {lng: selectedLanguage})} preview={false} width={20}
                            src='/pictograms/have.png'/> {t("pictograms.have", {lng: selectedLanguage})}</>
        },
        {
            value: 'areUsedFor',
            label: <><Image alt={t("pictograms.areUsedFor", {lng: selectedLanguage})} preview={false} width={20}
                            src='/pictograms/areUsedFor.png'/> {t("pictograms.areUsedFor", {lng: selectedLanguage})}</>
        },
        {
            value: 'areIn',
            label: <><Image alt={t("pictograms.areIn", {lng: selectedLanguage})} preview={false} width={20}
                            src='/pictograms/areIn.png'/> {t("pictograms.areIn", {lng: selectedLanguage})}</>
        }
    ];

    const getSelectionLimit = (networkType) => {
        switch (networkType) {
            case 'I-I':
                return 1;
            case 'I-II':
                return 2;
            case 'I-III':
                return 3;
            default:
                return 1;
        }
    };

    const onFinish = async (values) => {
        const formData = {
            ...values,
            mainImage: selectedMainImages?.length > 0 ? selectedMainImages[0] : undefined,
            definitionImage: selectedDefinitionImages?.length > 0 ? selectedDefinitionImages[0] : undefined,
            ampliationImages: selectedAmpliationImages?.length > 0 ? selectedAmpliationImages : undefined,
        };

        const result = await onSubmit(formData);
        if (result?.error) {
            setMessage({error: result.error});
        }
    };

    // Memoizar los valores iniciales del formulario para evitar renders innecesarios
    const formInitialValues = useMemo(() => ({
        ...initialValues,
        ampliationText: initialValues?.ampliationText || [],
        language: initialValues?.language ? [initialValues.language] : undefined,
        category: initialValues?.category ? [initialValues.category] : undefined,
        networkType: initialValues?.networkType ? [initialValues.networkType] : undefined,
        definitionPictogram: initialValues?.definitionPictogram ? [initialValues.definitionPictogram] : undefined,
        ampliationPictogram: initialValues?.ampliationPictogram ? [initialValues.ampliationPictogram] : undefined,
    }), [initialValues?.language, initialValues?.category, initialValues?.networkType,
        initialValues?.definitionPictogram, initialValues?.ampliationPictogram,
        initialValues?.ampliationText]);

    return (
        <Card title={title} style={{width: isMobile ? "90vw" : "65vw", marginTop: "2vh"}}>
            {message?.error?.type &&
                <Alert type="error" message={t(message?.error?.type)} showIcon style={{marginBottom: "1vh"}}/>}
            <Form
                form={form}
                name="exercise_form"
                labelCol={{
                    xs: {span: 24}, sm: {span: 10},
                }}
                wrapperCol={{
                    xs: {span: 24}, sm: {span: 16},
                }}
                onFinish={onFinish}
                scrollToFirstError
                initialValues={formInitialValues}
            >
                <Form.Item
                    name="language"
                    label={t("exercise.create.label.language")}
                    rules={[{required: true, message: t("exercise.create.error.language")}]}
                    validateStatus={message?.error?.lastName ? 'error' : undefined}
                    help={message?.error?.lastName ? t(message?.error?.lastName) : undefined}
                    hasFeedback
                    wrapperCol={{xs: {span: 14}, sm: {span: 10}, md: {span: 9}, lg: {span: 7}, xl: {span: 5}}}
                >
                    <Cascader options={languageOptions} placeholder={t("exercise.create.placeholder.language")}
                              onChange={(value) => setSelectedLanguage(value ? value[0] : i18n.language.split("-")[0])}/>
                </Form.Item>
                <Form.Item
                    name="category"
                    label={t("exercise.create.label.category")}
                    rules={[{required: true, message: t("exercise.create.error.category")}]}
                    validateStatus={message?.error?.name ? 'error' : undefined}
                    help={message?.error?.name ? t(message?.error?.name) : undefined}
                    hasFeedback
                    wrapperCol={{xs: {span: 16}, sm: {span: 12}, md: {span: 9}, lg: {span: 8}, xl: {span: 5}}}
                >
                    <Cascader options={categoryOptions} placeholder={t("exercise.create.placeholder.category")}/>
                </Form.Item>
                <Form.Item
                    name="networkType"
                    label={t("exercise.create.label.networkType")}
                    rules={[{required: true, message: t("exercise.create.error.networkType")}]}
                >
                    <Cascader
                        options={networkTypeOptions}
                        placeholder={t("exercise.create.placeholder.networkType")}
                        onChange={(value) => {
                            if (!value) return;

                            const selected = value[0];
                            setNetworkType(selected);

                            const limit = getSelectionLimit(selected);

                            form.setFieldsValue({
                                ampliationText: Array(limit).fill("")
                            });
                        }}
                    />
                </Form.Item>
                <Form.Item
                    name="title"
                    label={t("exercise.create.label.title")}
                    rules={[{required: true, message: t("exercise.create.error.title"), whitespace: true}]}
                    validateStatus={message?.error?.name ? 'error' : undefined}
                    help={message?.error?.name ? t(message?.error?.name) : undefined}
                    hasFeedback
                    wrapperCol={{xs: {span: 18}, sm: {span: 10}, md: {span: 12}, lg: {span: 9}, xl: {span: 7}}}
                >
                    <Input placeholder={t("exercise.create.placeholder.title")} onInput={() => setMessage(null)}/>
                </Form.Item>
                <Form.Item
                    name="mainImage"
                    label={t("exercise.create.label.mainImage")}
                    required
                    validateStatus={selectedMainImages.length === 0 && message?.error?.mainImage ? 'error' : ''}
                    help={selectedMainImages.length === 0 && message?.error?.mainImage ? t(message?.error?.mainImage) : undefined}
                >
                    <div>
                        {selectedMainImages && selectedMainImages.map(image => <Image alt='Imagen seleccionada'
                                                                                      key={image} preview={false}
                                                                                      width="4vmax"
                                                                                      src={`${process.env.REACT_APP_ARASAAC_URL}/pictograms/${image}`}/>)}
                        {selectedMainImages.length > 0 ?
                            <Button type="primary" danger onClick={() => setSelectedMainImages([])}>Clear</Button> :
                            <Button ghost type="primary" onClick={() => setOpenMain(true)}>Select mainImage</Button>}
                    </div>
                </Form.Item>
                <Form.Item
                    name="definitionPictogram"
                    label={t("exercise.create.label.definitionPictogram")}
                    rules={[{required: true, message: t("exercise.create.error.definitionPictogram")}]}
                    validateStatus={message?.error?.lastName ? 'error' : undefined}
                    help={message?.error?.lastName ? t(message?.error?.lastName) : undefined}
                    hasFeedback
                    wrapperCol={{xs: {span: 24}, sm: {span: 18}, md: {span: 14}, lg: {span: 11}, xl: {span: 8}}}
                >
                    <Cascader options={definitionPictogramOptions}
                              placeholder={t("exercise.create.placeholder.definitionPictogram")}/>
                </Form.Item>

                <Form.Item
                    name="definitionText"
                    label={t("exercise.create.label.definitionText")}
                    rules={[{required: true, message: t("exercise.create.error.definitionText"), whitespace: true}]}
                    validateStatus={message?.error?.name ? 'error' : undefined}
                    help={message?.error?.name ? t(message?.error?.name) : undefined}
                    hasFeedback
                    wrapperCol={{xs: {span: 18}, sm: {span: 12}, md: {span: 11}, lg: {span: 9}, xl: {span: 6}}}
                >
                    <Input placeholder={t("exercise.create.placeholder.definitionText")}
                           onInput={() => setMessage(null)}/>
                </Form.Item>
                <Form.Item
                    name="definitionImage"
                    required
                    label={t("exercise.create.label.definitionImage")}
                    validateStatus={selectedDefinitionImages.length === 0 && message?.error?.definitionImage ? 'error' : ''}
                    help={selectedDefinitionImages.length === 0 && message?.error?.definitionImage ? t(message?.error?.definitionImage) : undefined}
                >
                    <div>
                        {selectedDefinitionImages && selectedDefinitionImages.map(image => <Image
                            alt='Imagen seleccionada' key={image} preview={false} width="4vmax"
                            src={`${process.env.REACT_APP_ARASAAC_URL}/pictograms/${image}`}/>)}
                        {selectedDefinitionImages.length > 0 ? <Button type="primary" danger
                                                                       onClick={() => setSelectedDefinitionImages([])}>Clear</Button> :
                            <Button ghost type="primary" onClick={() => setOpenDefinition(true)}>Select
                                definitionImage</Button>}
                    </div>
                </Form.Item>
                <Form.Item
                    name="ampliationPictogram"
                    label={t("exercise.create.label.ampliationPictogram")}
                    rules={[{required: true, message: t("exercise.create.error.ampliationPictogram")}]}
                    validateStatus={message?.error?.lastName ? 'error' : undefined}
                    help={message?.error?.lastName ? t(message?.error?.lastName) : undefined}
                    hasFeedback
                    wrapperCol={{xs: {span: 24}, sm: {span: 18}, md: {span: 14}, lg: {span: 11}, xl: {span: 8}}}
                >
                    <Cascader options={ampliationPictogramOptions}
                              placeholder={t("exercise.create.placeholder.ampliationPictogram")}/>
                </Form.Item>
                <Form.Item
                    label={t("exercise.create.label.ampliationText")}
                    wrapperCol={{xs: {span: 18}, sm: {span: 12}, md: {span: 11}, lg: {span: 9}, xl: {span: 6}}}
                >
                    <Form.List name="ampliationText">
                        {(fields) => (<>
                            {fields.map((field, index) => (<Form.Item
                                {...field}
                                key={field.key}
                                rules={[{
                                    required: true,
                                    message: t("exercise.create.error.ampliationText"),
                                    whitespace: true,
                                },]}
                            >
                                <Input
                                    placeholder={`${t("exercise.create.placeholder.ampliationText")} ${index + 1}`}
                                    onInput={() => setMessage(null)}
                                />
                            </Form.Item>))}
                        </>)}
                    </Form.List>
                </Form.Item>
                <Form.Item
                    name="ampliationImages"
                    required
                    label={t("exercise.create.label.ampliationImage")}
                    validateStatus={selectedAmpliationImages.length === 0 && message?.error?.ampliationImages ? 'error' : ''}
                    help={selectedAmpliationImages.length === 0 && message?.error?.ampliationImages ? t(message?.error?.ampliationImages) : undefined}
                >
                    <div>
                        {selectedAmpliationImages && selectedAmpliationImages.map(image => <Image
                            alt='Imagen seleccionada' key={image} preview={false} width="4vmax"
                            src={`${process.env.REACT_APP_ARASAAC_URL}/pictograms/${image}`}/>)}
                        {selectedAmpliationImages.length > 0 ? <Button type="primary" danger
                                                                       onClick={() => setSelectedAmpliationImages([])}>Clear</Button> :
                            <Button ghost type="primary" onClick={() => setOpenAmpliation(true)}>Select
                                ampliationImage</Button>}
                    </div>
                </Form.Item>
                <Form.Item style={{float: "right"}}>
                    <Button type="primary" htmlType="submit">
                        {submitButtonText}
                    </Button>
                </Form.Item>
            </Form>
            <SelectImageModal setMessage={setMessage} setOpen={setOpenMain} open={openMain}
                              selectedImages={selectedMainImages} setSelectedImages={setSelectedMainImages}
                              selectionLimit={1}/>
            <SelectImageModal setMessage={setMessage} setOpen={setOpenDefinition} open={openDefinition}
                              selectedImages={selectedDefinitionImages} setSelectedImages={setSelectedDefinitionImages}
                              selectionLimit={1}/>
            <SelectImageModal setMessage={setMessage} setOpen={setOpenAmpliation} open={openAmpliation}
                              selectedImages={selectedAmpliationImages} setSelectedImages={setSelectedAmpliationImages}
                              selectionLimit={getSelectionLimit(networkType)}/>
        </Card>
    );
};

export default ExerciseForm;