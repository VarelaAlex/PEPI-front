import {Card, Flex, Image, Typography} from "antd";
import {useTranslation} from 'react-i18next';

const {Paragraph, Text} = Typography;

const Funding = () => {

    let {t} = useTranslation();
    let images = [
        {src: "/images/ministerio.webp", alt: "Ministerio de Ciencia, Innovación y Universidades"},
        {src: "/images/UE.webp", alt: "Cofinanciado por la UE"},
        {src: "/images/agencia-investigacion.webp", alt: "Agencia Estatal de Investigación"},
        {src: "/images/adir.webp", alt: "ADIR"}
    ]

    return (<Card
        title={t("funding.title")}
        style={{width: "80%"}}
    >
        <Paragraph style={{ textAlign: "center", fontSize: 16 }}>{t("funding.body")}</Paragraph>
        <Paragraph strong style={{ textAlign: "center",  fontSize: 20 }}>{t("funding.code")}</Paragraph>
        <Flex gap="large" style={{marginTop: "2vh"}} wrap>
            {images.map((img) => (<Image
                    src={img.src}
                    preview={false}
                    alt={img.alt}
                    style={{maxHeight: 80}}
                />))}
        </Flex>
    </Card>);
};

export default Funding;
