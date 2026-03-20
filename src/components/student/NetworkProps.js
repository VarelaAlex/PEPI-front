import {normalizeKey} from "../../services/normalize";

export const X = 210;
export const Y = 25;

export const pathTop = (networkType) => {
	if ( networkType === "I-I" ) {
		return "L 350 85 L 350 95";
	}
	if ( networkType === "I-II" ) {
		return "L 480 85 L 480 95";
	}
	if ( networkType === "I-III" ) {
		return "L 570 85 L 570 95";
	}
};

export const pathBottom = (networkType) => {
	if ( networkType === "I-I" ) {
		return "L 350 150";
	}
	if ( networkType === "I-II" ) {
		return "L 350 150 L 480 150 L 480 150";
	}
	if ( networkType === "I-III" ) {
		return "L 350 150 L 570 150 L 570 145";
	}
};

export const pathBottom2 = (networkType) => {
	if ( networkType === "I-II" ) {
		return "M 480 145 L 480 150 L 610 150 L 610 165";
	}
	if ( networkType === "I-III" ) {
		return "M 570 145 L 570 165";
	}
};

export const nexusX = (networkType) => {
	if ( networkType === "I-I" ) {
		return 130;
	}
	if ( networkType === "I-II" ) {
		return 260;
	}
	if ( networkType === "I-III" ) {
		return 350;
	}
};

export const viewBoxWidth = (networkType) => {
	if ( networkType === "I-I" ) {
		return 500;
	}
	if ( networkType === "I-II" ) {
		return 750;
	}
	if ( networkType === "I-III" ) {
		return 950;
	}
};

export const stopX = (networkType) => {
	if ( networkType === "I-I" ) {
		return 90;
	}
	if ( networkType === "I-II" ) {
		return 210;
	}
	if ( networkType === "I-III" ) {
		return 310;
	}
};

export const STOP = 8289;

let type1X = (networkType) => {
	if ( "I-I" === networkType ) {
		return 0;
	}
	if ( "I-II" === networkType ) {
		return 90;
	}
	if ( "I-III" === networkType ) {
		return 240;
	}
};

export let nodes = (exercise) => {
	const { representation, mainImage, definitionPictogram, definitionImage, definitionText, ampliationPictogram, ampliationImages, ampliationText, title, networkType } = exercise;

	const baseNodes = [
		{
			id:    "1",
			type:  "type1",
			posX:  type1X(networkType),
			posY:  0,
			src:   ["ICONIC", "MIXED"].includes(representation) ? `${ process.env.REACT_APP_ARASAAC_URL }/pictograms/${ mainImage }` : null,
			text:  ["MIXED", "SYMBOLIC", "GLOBAL"].includes(representation) ? title : null,
			shape: "rect",
			sound: `${normalizeKey(title)}`
		}, {
			order: 2,
			id:    "2",
			type:  "type2",
			posX:  -160,
			posY:  90,
			src:   ["ICONIC", "MIXED"].includes(representation) ? `/pictograms/${ definitionPictogram }.png` : null,
			nexus: true,
			text:  ["MIXED", "SYMBOLIC", "GLOBAL"].includes(representation) ? `pictograms.${ definitionPictogram }` : null,
			sound: `${definitionPictogram}`
		}, {
			order: 3,
			id:    "3",
			type:  "type3",
			posX:  -160,
			posY:  170,
			shape: "ellipse",
			src:   ["ICONIC", "MIXED"].includes(representation) ? `${ process.env.REACT_APP_ARASAAC_URL }/pictograms/${ definitionImage }` : null,
			text:  ["MIXED", "SYMBOLIC", "GLOBAL"].includes(representation) ? definitionText : null,
			sound: `${normalizeKey(definitionText)}`
		}, {
			order: 6,
			id:    "4",
			type:  "type4",
			posX:  nexusX(networkType),
			posY:  90,
			src:   ["ICONIC", "MIXED"].includes(representation) ? `/pictograms/${ ampliationPictogram }.png` : null,
			nexus: true,
			text:  ["MIXED", "SYMBOLIC", "GLOBAL"].includes(representation) ? `pictograms.${ ampliationPictogram }` : null,
			sound: `${ampliationPictogram}`
		}, {
			order: 7,
			id:    "5",
			type:  "type5",
			posX:  130,
			posY:  170,
			shape: "ellipse",
			src:   ["ICONIC", "MIXED"].includes(representation) ? `${ process.env.REACT_APP_ARASAAC_URL }/pictograms/${ ampliationImages[ 0 ] }` : null,
			text:  ["MIXED", "SYMBOLIC", "GLOBAL"].includes(representation) ? ampliationText[ 0 ] : null,
			sound: `${normalizeKey(ampliationText[0])}`
		}, {
			id: "6",
			type: "type6",
			posX: -70,
			posY: 190,
			text: ["MIXED", "SYMBOLIC", "GLOBAL"].includes(representation) ? "." : null,
			sound: `stop`
		}
	];

	if ( networkType === "I-II" || networkType === "I-III" ) {
		baseNodes.push({
			               order: 8,
			               id:    "7",
			               type:  "type7",
			               posX:  240,
			               posY:  190,
			               text:  ["MIXED", "SYMBOLIC", "GLOBAL"].includes(representation) ? (
				               networkType === "I-II" ? exercise.language === "es" ? "y" : "and" : ","
			               ) : null,
			               src:   ["ICONIC", "MIXED"].includes(representation) ? `${ process.env.REACT_APP_ARASAAC_URL }/pictograms/${ STOP }` : null,
			               stop:  true,
			               sound: networkType === "I-II" ? "and" : "comma"
		               }, {
			               order: 9,
			               id:    "8",
			               type:  "type8",
			               posX:  networkType === "I-II" ? 390 : 350,
			               posY:  170,
			               shape: "ellipse",
			               src:   ["ICONIC", "MIXED"].includes(representation) ? `${ process.env.REACT_APP_ARASAAC_URL }/pictograms/${ ampliationImages[ 1 ] }` : null,
			               text:  ["MIXED", "SYMBOLIC", "GLOBAL"].includes(representation) ? ampliationText[ 1 ] : null,
			sound: `${normalizeKey(ampliationText[1])}`
		               });
	}

	if ( networkType === "I-III" ) {
		baseNodes.push({
			               order: 10,
			               id:    "9",
			               type:  "type9",
			               posX:  460,
			               posY:  190,
			               text:  ["MIXED", "SYMBOLIC", "GLOBAL"].includes(representation) ? exercise.language === "es" ? "y" : "and" : null,
			               src:   ["ICONIC", "MIXED"].includes(representation) ? `${ process.env.REACT_APP_ARASAAC_URL }/pictograms/${ STOP }` : null,
			               stop:  true,
					       sound: "and"
		               }, {
			               order: 11,
			               id:    "10",
			               type:  "type10",
			               posX:  570,
			               posY:  170,
			               shape: "ellipse",
			               src:   ["ICONIC", "MIXED"].includes(representation) ? `${ process.env.REACT_APP_ARASAAC_URL }/pictograms/${ ampliationImages[ 2 ] }` : null,
			               text:  ["MIXED", "SYMBOLIC", "GLOBAL"].includes(representation) ? ampliationText[ 2 ] : null,
						   sound: `${normalizeKey(ampliationText[2])}`
		               });
	}

	return baseNodes;
};
