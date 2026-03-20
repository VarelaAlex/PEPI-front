import {STOP} from "../NetworkProps";

export const baseSentences = [{
    id: 1,
    phrase: [{
        text: "El perro", image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/7202`, audio: ("dog")
    }, {text: "es", image: "/pictograms/is.png", audio: ("is"), draggable: true}, {
        text: "un animal", image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/6901`, audio: ("animal")
    }, {text: ".", image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/${STOP}`, audio: ("stop")}],
    audio: ("dog-animal")
}, {
    id: 2,
    phrase: [{
        text: "El perro", image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/7202`, audio: ("dog")
    }, {text: "tiene", image: "/pictograms/has.png", audio: ("has"), draggable: true}, {
        text: "cola", image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/5967`, audio: ("tail")
    }, {text: ".", image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/${STOP}`, audio: ("stop")}],
    audio: ("dog-tail")
}, {
    id: 3,
    phrase: [{
        text: "La ballena", image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/2268`, audio: ("whale")
    }, {text: "es", image: "/pictograms/is.png", audio: ("is"), draggable: true}, {
        text: "un mamífero", image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/7777`, audio: ("mammal")
    }, {text: ".", image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/${STOP}`, audio: ("stop")}],
    audio: ("whale-mammal")
}, {
    id: 4,
    phrase: [{
        text: "La ballena", image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/2268`, audio: ("whale")
    }, {text: "está en", image: "/pictograms/isIn.png", audio: ("isIn"), draggable: true}, {
        text: "el mar", image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/2925`, audio: ("sea")
    }, {text: ".", image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/${STOP}`, audio: ("stop")}],
    audio: ("whale-sea")
}, // ... rest unchanged (kept as in original)
    {
        id: 5,
        phrase: [{
            text: "La casa", image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/6964`, audio: ("house")
        }, {text: "es para", image: "/pictograms/isFor.png", audio: ("isFor"), draggable: true}, {
            text: "vivir", image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/11605`, audio: ("living")
        }, {text: ".", image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/${STOP}`, audio: ("stop")}],
        audio: ("house-living")
    }, {
        id: 6,
        phrase: [{
            text: "La casa", image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/6964`, audio: ("house")
        }, {
            text: "sirve para", image: "/pictograms/isUsedFor.png", audio: ("isUsedFor"), draggable: true
        }, {
            text: "vivir", image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/11605`, audio: ("living")
        }, {text: ".", image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/${STOP}`, audio: ("stop")}],
        audio: ("house-living2")
    }, {
        id: 7,
        phrase: [{
            text: "El sol", image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/7252`, audio: ("sun")
        }, {text: "es", image: "/pictograms/is.png", audio: ("is"), draggable: true}, {
            text: "una estrella", image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/2752`, audio: ("star")
        }, {text: ".", image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/${STOP}`, audio: ("stop")}],
        audio: ("sun-star")
    }, {
        id: 8,
        phrase: [{
            text: "El sol", image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/7252`, audio: ("sun")
        }, {text: "está en", image: "/pictograms/isIn.png", audio: ("isIn"), draggable: true}, {
            text: "el cielo", image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/6978`, audio: ("sunbathing")
        }, {text: ".", image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/${STOP}`, audio: ("stop")}],
        audio: ("sun-sunbathing")
    }, {
        id: 9,
        phrase: [{
            text: "El verano", image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/5604`, audio: ("summer")
        }, {
            text: "es parte de", image: "/pictograms/isPartOf.png", audio: ("isPartOf"), draggable: true
        }, {
            text: "el año", image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/6903`, audio: ("year")
        }, {text: ".", image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/${STOP}`, audio: ("stop")}],
        audio: ("summer-year")
    }, {
        id: 10,
        phrase: [{
            text: "El verano", image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/5604`, audio: ("summer")
        }, {
            text: "sirve para", image: "/pictograms/isUsedFor.png", audio: ("isUsedFor"), draggable: true
        }, {
            text: "tomar el sol",
            image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/26500`,
            audio: ("sunbathing")
        }, {text: ".", image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/${STOP}`, audio: ("stop")}],
        audio: ("summer-sunbathing")
    }, {
        id: 11,
        phrase: [{
            text: "La manzana", image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/2462`, audio: ("apple")
        }, {text: "es", image: "/pictograms/is.png", audio: ("is"), draggable: true}, {
            text: "una fruta", image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/28339`, audio: ("fruit")
        }, {text: ".", image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/${STOP}`, audio: ("stop")}],
        audio: ("apple-fruit")
    }, {
        id: 12,
        phrase: [{
            text: "La manzana", image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/2462`, audio: ("apple")
        }, {text: "está en", image: "/pictograms/isIn.png", audio: ("isIn"), draggable: true}, {
            text: "el frutero", image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/16303`, audio: ("fruitBowl")
        }, {text: ".", image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/${STOP}`, audio: ("stop")}],
        audio: ("apple-fruitBowl")
    }, {
        id: 13,
        phrase: [{
            text: "La cama", image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/25900`, audio: ("bed")
        }, {text: "es para", image: "/pictograms/isFor.png", audio: ("isFor"), draggable: true}, {
            text: "dormir", image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/6479`, audio: ("sleeping")
        }, {text: ".", image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/${STOP}`, audio: ("stop")}],
        audio: ("bed-sleeping")
    }, {
        id: 14,
        phrase: [{
            text: "La cama", image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/25900`, audio: ("bed")
        }, {
            text: "está en", image: "/pictograms/isIn.png", audio: ("isIn"), draggable: true
        }, {
            text: "la habitación",
            image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/33068`,
            audio: ("bedroom")
        }, {text: ".", image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/${STOP}`, audio: ("stop")}],
        audio: ("bed-bedroom")
    }, {
        id: 15,
        phrase: [{
            text: "La calle", image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/2299`, audio: ("street")
        }, {
            text: "es parte de", image: "/pictograms/isPartOf.png", audio: ("isPartOf"), draggable: true
        }, {
            text: "la ciudad", image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/2704`, audio: ("city")
        }, {text: ".", image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/${STOP}`, audio: ("stop")}],
        audio: ("street-city")
    }, {
        id: 16,
        phrase: [{
            text: "La calle", image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/2299`, audio: ("street")
        }, {text: "está en", image: "/pictograms/isIn.png", audio: ("isIn"), draggable: true}, {
            text: "la ciudad", image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/2704`, audio: ("city")
        }, {text: ".", image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/${STOP}`, audio: ("stop")}],
        audio: ("street-city2")
    }, {
        id: 17,
        phrase: [{
            text: "El coche", image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/2339`, audio: ("car")
        }, {text: "es para", image: "/pictograms/isFor.png", audio: ("isFor"), draggable: true}, {
            text: "viajar", image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/36974`, audio: ("traveling")
        }, {text: ".", image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/${STOP}`, audio: ("stop")}],
        audio: ("car-traveling")
    }, {
        id: 18,
        phrase: [{
            text: "El coche", image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/2339`, audio: ("car")
        }, {text: "tiene", image: "/pictograms/has.png", audio: ("has"), draggable: true}, {
            text: "ruedas", image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/6209`, audio: ("wheels")
        }, {text: ".", image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/${STOP}`, audio: ("stop")}],
        audio: ("car-wheels")
    }, {
        id: 19,
        phrase: [{
            text: "El columpio", image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/4608`, audio: ("swing")
        }, {text: "es para", image: "/pictograms/isFor.png", audio: ("isFor"), draggable: true}, {
            text: "jugar", image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/6537`, audio: ("playing")
        }, {text: ".", image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/${STOP}`, audio: ("stop")}],
        audio: ("swing-playing")
    }, {
        id: 20,
        phrase: [{
            text: "El columpio", image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/4608`, audio: ("swing")
        }, {text: "está en", image: "/pictograms/isIn.png", audio: ("isIn"), draggable: true}, {
            text: "el parque", image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/2859`, audio: ("park")
        }, {text: ".", image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/${STOP}`, audio: ("stop")}],
        audio: ("swing-park")
    }, {
        id: 21,
        phrase: [{
            text: "El agua", image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/2248`, audio: ("water")
        }, {text: "es para", image: "/pictograms/isFor.png", audio: ("isFor"), draggable: true}, {
            text: "beber", image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/6061`, audio: ("drinking")
        }, {text: ".", image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/${STOP}`, audio: ("stop")}],
        audio: ("water-drinking")
    }, {
        id: 22,
        phrase: [{
            text: "El agua", image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/2248`, audio: ("water")
        }, {
            text: "sirve para", image: "/pictograms/isUsedFor.png", audio: ("isUsedFor"), draggable: true
        }, {
            text: "lavarse", image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/26803`, audio: ("washing")
        }, {text: ".", image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/${STOP}`, audio: ("stop")}],
        audio: ("water-drinking")
    }, {
        id: 23,
        phrase: [{
            text: "El mar", image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/2925`, audio: ("sea")
        }, {text: "es para", image: "/pictograms/isFor.png", audio: ("isFor"), draggable: true}, {
            text: "bañarse", image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/38782`, audio: ("bathing")
        }, {text: ".", image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/${STOP}`, audio: ("stop")}],
        audio: ("sea-bathing")
    }, {
        id: 24,
        phrase: [{
            text: "El mar", image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/2925`, audio: ("sea")
        }, {text: "está en", image: "/pictograms/isIn.png", audio: ("isIn"), draggable: true}, {
            text: "la playa", image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/30518`, audio: ("beach")
        }, {text: ".", image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/${STOP}`, audio: ("stop")}],
        audio: ("sea-beach")
    }];

export const sentences = [
    // TRÍO 1 – PERRO
    {
        phrase: [{
            text: "El perro", image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/7202`, audio: ("dog")
        }], audio: ("dog")
    }, {
        phrase: [{
            text: "El perro", image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/7202`, audio: ("dog")
        }, {text: "es", image: "/pictograms/is.png", audio: ("is"), draggable: true}, {
            text: "un animal", image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/6901`, audio: ("animal")
        }, {text: ".", image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/${STOP}`, audio: ("stop")}],
        audio: ("dog-animal")
    }, {
        phrase: [{
            text: "El perro", image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/7202`, audio: ("dog")
        }, {text: "tiene", image: "/pictograms/has.png", audio: ("has"), draggable: true}, {
            text: "cola", image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/5967`, audio: ("tail")
        }, {text: ".", image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/${STOP}`, audio: ("stop")}],
        audio: ("dog-tail")
    },

    // TRÍO 2 – BALLENA
    {
        phrase: [{
            text: "La ballena", image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/2268`, audio: ("whale")
        }], audio: ("whale")
    }, {
        phrase: [{
            text: "La ballena", image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/2268`, audio: ("whale")
        }, {text: "es", image: "/pictograms/is.png", audio: ("is"), draggable: true}, {
            text: "un mamífero", image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/7777`, audio: ("mammal")
        }, {text: ".", image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/${STOP}`, audio: ("stop")}],
        audio: ("whale-mammal")
    }, {
        phrase: [{
            text: "La ballena", image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/2268`, audio: ("whale")
        }, {text: "está en", image: "/pictograms/isIn.png", audio: ("isIn"), draggable: true}, {
            text: "el mar", image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/2925`, audio: ("sea")
        }, {text: ".", image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/${STOP}`, audio: ("stop")}],
        audio: ("whale-sea")
    },

    // TRÍO 3 – CASA
    {
        phrase: [{
            text: "La casa", image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/6964`, audio: ("house")
        }], audio: ("house")
    }, {
        phrase: [{
            text: "La casa", image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/6964`, audio: ("house")
        }, {text: "es para", image: "/pictograms/isFor.png", audio: ("isFor"), draggable: true}, {
            text: "vivir", image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/11605`, audio: ("living")
        }, {text: ".", image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/${STOP}`, audio: ("stop")}],
        audio: ("house-living")
    }, {
        phrase: [{
            text: "La casa", image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/6964`, audio: ("house")
        }, {text: "sirve para", image: "/pictograms/isUsedFor.png", audio: ("isUsedFor"), draggable: true}, {
            text: "vivir", image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/11605`, audio: ("living")
        }, {text: ".", image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/${STOP}`, audio: ("stop")}],
        audio: ("house-living2")
    },

    // TRÍO 4 – SOL
    {
        phrase: [{text: "El sol", image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/7252`, audio: ("sun")}],
        audio: ("sun")
    }, {
        phrase: [{
            text: "El sol", image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/7252`, audio: ("sun")
        }, {text: "es", image: "/pictograms/is.png", audio: ("is"), draggable: true}, {
            text: "una estrella", image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/2752`, audio: ("star")
        }, {text: ".", image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/${STOP}`, audio: ("stop")}],
        audio: ("sun-star")
    }, {
        phrase: [{
            text: "El sol", image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/7252`, audio: ("sun")
        }, {text: "está en", image: "/pictograms/isIn.png", audio: ("isIn"), draggable: true}, {
            text: "el cielo", image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/6978`, audio: ("sky")
        }, {text: ".", image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/${STOP}`, audio: ("stop")}],
        audio: ("sun-sky")
    },

    // TRÍO 5 – VERANO
    {
        phrase: [{
            text: "El verano", image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/5604`, audio: ("summer")
        }], audio: ("summer")
    }, {
        phrase: [{
            text: "El verano", image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/5604`, audio: ("summer")
        }, {text: "es parte de", image: "/pictograms/isPartOf.png", audio: ("isPartOf"), draggable: true}, {
            text: "el año", image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/6903`, audio: ("year")
        }, {text: ".", image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/${STOP}`, audio: ("stop")}],
        audio: ("summer-year")
    }, {
        phrase: [{
            text: "El verano", image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/5604`, audio: ("summer")
        }, {text: "sirve para", image: "/pictograms/isUsedFor.png", audio: ("isUsedFor"), draggable: true}, {
            text: "tomar el sol",
            image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/26500`,
            audio: ("sunbathing")
        }, {text: ".", image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/${STOP}`, audio: ("stop")}],
        audio: ("summer-sunbathing")
    },

    // TRÍO 6 – MANZANA
    {
        phrase: [{
            text: "La manzana", image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/2462`, audio: ("apple")
        }], audio: ("apple")
    }, {
        phrase: [{
            text: "La manzana", image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/2462`, audio: ("apple")
        }, {text: "es", image: "/pictograms/is.png", audio: ("is"), draggable: true}, {
            text: "una fruta", image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/28339`, audio: ("fruit")
        }, {text: ".", image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/${STOP}`, audio: ("stop")}],
        audio: ("apple-fruit")
    }, {
        phrase: [{
            text: "La manzana", image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/2462`, audio: ("apple")
        }, {text: "está en", image: "/pictograms/isIn.png", audio: ("isIn"), draggable: true}, {
            text: "el frutero", image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/16303`, audio: ("fruitBowl")
        }, {text: ".", image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/${STOP}`, audio: ("stop")}],
        audio: ("apple-fruitBowl")
    },

    // TRÍO 7 – CAMA
    {
        phrase: [{
            text: "La cama", image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/25900`, audio: ("bed")
        }], audio: ("bed")
    }, {
        phrase: [{
            text: "La cama", image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/25900`, audio: ("bed")
        }, {text: "es para", image: "/pictograms/isFor.png", audio: ("isFor"), draggable: true}, {
            text: "dormir", image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/6479`, audio: ("sleeping")
        }, {text: ".", image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/${STOP}`, audio: ("stop")}],
        audio: ("bed-sleeping")
    }, {
        phrase: [{
            text: "La cama", image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/25900`, audio: ("bed")
        }, {text: "está en", image: "/pictograms/isIn.png", audio: ("isIn"), draggable: true}, {
            text: "la habitación",
            image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/33068`,
            audio: ("bedroom")
        }, {text: ".", image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/${STOP}`, audio: ("stop")}],
        audio: ("bed-bedroom")
    },

    // TRÍO 8 – CALLE
    {
        phrase: [{
            text: "La calle", image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/2299`, audio: ("street")
        }], audio: ("street")
    }, {
        phrase: [{
            text: "La calle", image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/2299`, audio: ("street")
        }, {text: "es parte de", image: "/pictograms/isPartOf.png", audio: ("isPartOf"), draggable: true}, {
            text: "la ciudad", image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/2704`, audio: ("city")
        }, {text: ".", image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/${STOP}`, audio: ("stop")}],
        audio: ("street-city")
    }, {
        phrase: [{
            text: "La calle", image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/2299`, audio: ("street")
        }, {text: "está en", image: "/pictograms/isIn.png", audio: ("isIn"), draggable: true}, {
            text: "la ciudad", image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/2704`, audio: ("city")
        }, {text: ".", image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/${STOP}`, audio: ("stop")}],
        audio: ("street-city2")
    },

    // TRÍO 9 – COCHE
    {
        phrase: [{text: "El coche", image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/2339`, audio: ("car")}],
        audio: ("car")
    }, {
        phrase: [{
            text: "El coche", image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/2339`, audio: ("car")
        }, {text: "es para", image: "/pictograms/isFor.png", audio: ("isFor"), draggable: true}, {
            text: "viajar", image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/36974`, audio: ("traveling")
        }, {text: ".", image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/${STOP}`, audio: ("stop")}],
        audio: ("car-traveling")
    }, {
        phrase: [{
            text: "El coche", image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/2339`, audio: ("car")
        }, {text: "tiene", image: "/pictograms/has.png", audio: ("has"), draggable: true}, {
            text: "ruedas", image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/6209`, audio: ("wheels")
        }, {text: ".", image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/${STOP}`, audio: ("stop")}],
        audio: ("car-wheels")
    },

    // TRÍO 10 – COLUMPIO
    {
        phrase: [{
            text: "El columpio", image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/4608`, audio: ("swing")
        }], audio: ("swing")
    }, {
        phrase: [{
            text: "El columpio", image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/4608`, audio: ("swing")
        }, {text: "es para", image: "/pictograms/isFor.png", audio: ("isFor"), draggable: true}, {
            text: "jugar", image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/6537`, audio: ("playing")
        }, {text: ".", image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/${STOP}`, audio: ("stop")}],
        audio: ("swing-playing")
    }, {
        phrase: [{
            text: "El columpio", image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/4608`, audio: ("swing")
        }, {text: "está en", image: "/pictograms/isIn.png", audio: ("isIn"), draggable: true}, {
            text: "el parque", image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/2859`, audio: ("park")
        }, {text: ".", image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/${STOP}`, audio: ("stop")}],
        audio: ("swing-park")
    },

    // TRÍO 11 – AGUA
    {
        phrase: [{
            text: "El agua", image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/2248`, audio: ("water")
        }], audio: ("water")
    }, {
        phrase: [{
            text: "El agua", image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/2248`, audio: ("water")
        }, {text: "es para", image: "/pictograms/isFor.png", audio: ("isFor"), draggable: true}, {
            text: "beber", image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/6061`, audio: ("drinking")
        }, {text: ".", image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/${STOP}`, audio: ("stop")}],
        audio: ("water-drinking")
    }, {
        phrase: [{
            text: "El agua", image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/2248`, audio: ("water")
        }, {text: "sirve para", image: "/pictograms/isUsedFor.png", audio: ("isUsedFor"), draggable: true}, {
            text: "lavarse", image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/26803`, audio: ("washing")
        }, {text: ".", image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/${STOP}`, audio: ("stop")}],
        audio: ("water-washing")
    },

    // TRÍO 12 – MAR
    {
        phrase: [{text: "El mar", image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/2925`, audio: ("sea")}],
        audio: ("sea")
    }, {
        phrase: [{
            text: "El mar", image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/2925`, audio: ("sea")
        }, {text: "es para", image: "/pictograms/isFor.png", audio: ("isFor"), draggable: true}, {
            text: "bañarse", image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/38782`, audio: ("bathing")
        }, {text: ".", image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/${STOP}`, audio: ("stop")}],
        audio: ("sea-bathing")
    }, {
        phrase: [{
            text: "El mar", image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/2925`, audio: ("sea")
        }, {text: "está en", image: "/pictograms/isIn.png", audio: ("isIn"), draggable: true}, {
            text: "la playa", image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/30518`, audio: ("beach")
        }, {text: ".", image: `${process.env.REACT_APP_ARASAAC_URL}/pictograms/${STOP}`, audio: ("stop")}],
        audio: ("sea-beach")
    },];


export const exercises = [
    {
        activity: "1",
        content: [
            {
                id: 1,
                phraseKey: "dog-animal",
                wordAudio: ["dog", "is", "animal"],
                image: [
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/7202`,
                    "/pictograms/is.png",
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/6901`
                ]
            },
            {
                id: 2,
                phraseKey: "whale-mammal",
                wordAudio: ["whale", "is", "mammal"],
                image: [
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/2268`,
                    "/pictograms/is.png",
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/7777`
                ]
            },
            {
                id: 3,
                phraseKey: "house-living",
                wordAudio: ["house", "isFor", "living"],
                image: [
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/6964`,
                    "/pictograms/is.png",
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/11605`
                ]
            },
            {
                id: 4,
                phraseKey: "sun-star",
                wordAudio: ["sun", "is", "star"],
                image: [
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/7252`,
                    "/pictograms/is.png",
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/2752`
                ]
            },
            {
                id: 5,
                phraseKey: "summer-year",
                wordAudio: ["summer", "isPartOf", "year"],
                image: [
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/5604`,
                    "/pictograms/isPartOf.png",
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/6903`
                ]
            },
            {
                id: 6,
                phraseKey: "apple-fruit",
                wordAudio: ["apple", "is", "fruit"],
                image: [
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/2462`,
                    "/pictograms/is.png",
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/28339`
                ]
            },
            {
                id: 7,
                phraseKey: "bed-sleeping",
                wordAudio: ["bed", "isFor", "sleeping"],
                image: [
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/25900`,
                    "/pictograms/isFor.png",
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/6479`
                ]
            },
            {
                id: 8,
                phraseKey: "street-city",
                wordAudio: ["street", "isPartOf", "city"],
                image: [
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/2299`,
                    "/pictograms/isPartOf.png",
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/2704`
                ]
            },
            {
                id: 9,
                phraseKey: "car-traveling",
                wordAudio: ["car", "isFor", "traveling"],
                image: [
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/2339`,
                    "/pictograms/isFor.png",
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/36974`
                ]
            },
            {
                id: 10,
                phraseKey: "swing-playing",
                wordAudio: ["swing", "isFor", "playing"],
                image: [
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/4608`,
                    "/pictograms/isFor.png",
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/6537`
                ]
            },
            {
                id: 11,
                phraseKey: "water-drinking",
                wordAudio: ["water", "isFor", "drinking"],
                image: [
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/2248`,
                    "/pictograms/isFor.png",
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/6061`
                ]
            },
            {
                id: 12,
                phraseKey: "sea-bathing",
                wordAudio: ["sea", "isFor", "bathing"],
                image: [
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/2925`,
                    "/pictograms/isFor.png",
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/38782`
                ]
            },
            {
                id: 13,
                phraseKey: "juice-drink",
                wordAudio: ["juice", "is", "drink"],
                image: [
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/11461`,
                    "/pictograms/is.png",
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/30403`
                ]
            },
            {
                id: 15,
                phraseKey: "wheel-circle",
                wordAudio: ["wheel", "is", "circle"],
                image: [
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/6209`,
                    "/pictograms/is.png",
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/4603`
                ]
            },
            {
                id: 17,
                phraseKey: "train-transport",
                wordAudio: ["train", "is", "transport"],
                image: [
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/2603`,
                    "/pictograms/is.png",
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/10351`
                ]
            },
            {
                id: 19,
                phraseKey: "sky-blue",
                wordAudio: ["sky", "is", "blue"],
                image: [
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/38270`,
                    "/pictograms/is.png",
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/3355`
                ]
            },
            {
                id: 21,
                phraseKey: "banana-fruit",
                wordAudio: ["banana", "is", "fruit"],
                image: [
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/2530`,
                    "/pictograms/is.png",
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/4653`
                ]
            },
            {
                id: 23,
                phraseKey: "yellow-color",
                wordAudio: ["yellow", "is", "color"],
                image: [
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/2648`,
                    "/pictograms/is.png",
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/5968`
                ]
            },
            {
                id: 25,
                phraseKey: "penguin-animal",
                wordAudio: ["penguin", "is", "animal"],
                image: [
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/3243`,
                    "/pictograms/is.png",
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/6901`
                ]
            },
            {
                id: 27,
                phraseKey: "nose-breathing",
                wordAudio: ["nose", "isFor", "breathing"],
                image: [
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/2887`,
                    "/pictograms/isFor.png",
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/34377`
                ]
            },
            {
                id: 28,
                phraseKey: "scissors-cutting",
                wordAudio: ["scissors", "isFor", "cutting"],
                image: [
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/6664`,
                    "/pictograms/isFor.png",
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/2547`
                ]
            },
            {
                id: 29,
                phraseKey: "fork-eating",
                wordAudio: ["fork", "isFor", "eating"],
                image: [
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/2588`,
                    "/pictograms/isFor.png",
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/6456`
                ]
            },
            {
                id: 30,
                phraseKey: "beach-summer",
                wordAudio: ["beach", "isFor", "summer"],
                image: [
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/30518`,
                    "/pictograms/isFor.png",
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/5604`
                ]
            },
            {
                id: 31,
                phraseKey: "bottle-drinking",
                wordAudio: ["bottle", "isFor", "drinking"],
                image: [
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/39043`,
                    "/pictograms/isFor.png",
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/6061`
                ]
            },
            {
                id: 32,
                phraseKey: "chair-sitting",
                wordAudio: ["chair", "isFor", "sitting"],
                image: [
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/3155`,
                    "/pictograms/isFor.png",
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/6611`
                ]
            },
            {
                id: 33,
                phraseKey: "ludo-playing",
                wordAudio: ["ludo", "isFor", "playing"],
                image: [
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/2501`,
                    "/pictograms/isFor.png",
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/6537`
                ]
            },
            {
                id: 34,
                phraseKey: "comb-combing",
                wordAudio: ["comb", "isFor", "combing"],
                image: [
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/2852`,
                    "/pictograms/isFor.png",
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/26947`
                ]
            },
            {
                id: 35,
                phraseKey: "elbow-arm",
                wordAudio: ["elbow", "isPartOf", "arm"],
                image: [
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/2707`,
                    "/pictograms/isPartOf.png",
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/2669`
                ]
            },
            {
                id: 36,
                phraseKey: "window-house",
                wordAudio: ["window", "isPartOf", "house"],
                image: [
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/24465`,
                    "/pictograms/isPartOf.png",
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/6964`
                ]
            },
            {
                id: 37,
                phraseKey: "snow-winter",
                wordAudio: ["snow", "isPartOf", "winter"],
                image: [
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/7172`,
                    "/pictograms/isPartOf.png",
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/5493`
                ]
            },
            {
                id: 38,
                phraseKey: "school-city",
                wordAudio: ["school", "isPartOf", "city"],
                image: [
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/3082`,
                    "/pictograms/isPartOf.png",
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/2704`
                ]
            },
            {
                id: 39,
                phraseKey: "tongue-mouth",
                wordAudio: ["tongue", "isPartOf", "mouth"],
                image: [
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/2944`,
                    "/pictograms/isPartOf.png",
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/2663`
                ]
            },
            {
                id: 40,
                phraseKey: "fridge-kitchen",
                wordAudio: ["fridge", "isPartOf", "kitchen"],
                image: [
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/3272`,
                    "/pictograms/isPartOf.png",
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/33070`
                ]
            },
            {
                id: 41,
                phraseKey: "moon-night",
                wordAudio: ["moon", "isPartOf", "night"],
                image: [
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/2933`,
                    "/pictograms/isPartOf.png",
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/26997`
                ]
            },
        ]
    },

    {
        activity: "2",
        content: [
            {
                id: 1,
                phraseKey: "dog-tail",
                wordAudio: ["dog", "has", "tail"],
                image: [
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/7202`,
                    "/pictograms/has.png",
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/5967`
                ]
            },
            {
                id: 2,
                phraseKey: "whale-sea",
                wordAudio: ["whale", "isIn", "sea"],
                image: [
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/2268`,
                    "/pictograms/isIn.png",
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/2925`
                ]
            },
            {
                id: 3,
                phraseKey: "house-living2",
                wordAudio: ["house", "isUsedFor", "living"],
                image: [
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/6964`,
                    "/pictograms/isUsedFor.png",
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/11605`
                ]
            },
            {
                id: 4,
                phraseKey: "sun-sky",
                wordAudio: ["sun", "isIn", "sky"],
                image: [
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/7252`,
                    "/pictograms/isIn.png",
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/6978`
                ]
            },
            {
                id: 5,
                phraseKey: "summer-sunbathing",
                wordAudio: [
                    "summer",
                    "isUsedFor",
                    "sunbathing"
                ],
                image: [
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/5604`,
                    "/pictograms/isUsedFor.png",
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/26500`
                ]
            },
            {
                id: 6,
                phraseKey: "apple-fruitBowl",
                wordAudio: ["apple", "isIn", "fruitBowl"],
                image: [
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/2462`,
                    "/pictograms/isIn.png",
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/16303`
                ]
            },
            {
                id: 7,
                phraseKey: "bed-bedroom",
                wordAudio: ["bed", "isIn", "bedroom"],
                image: [
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/25900`,
                    "/pictograms/isIn.png",
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/33068`
                ]
            },
            {
                id: 8,
                phraseKey: "street-city2",
                wordAudio: ["street", "isIn", "city"],
                image: [
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/2299`,
                    "/pictograms/isIn.png",
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/2704`
                ]
            },
            {
                id: 9,
                phraseKey: "car-wheels",
                wordAudio: ["car", "has", "wheels"],
                image: [
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/2339`,
                    "/pictograms/has.png",
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/6209`
                ]
            },
            {
                id: 10,
                phraseKey: "swing-park",
                wordAudio: ["swing", "isIn", "park"],
                image: [
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/4608`,
                    "/pictograms/isIn.png",
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/2859`
                ]
            },
            {
                id: 11,
                phraseKey: "water-washing",
                wordAudio: ["water", "isUsedFor", "washing"],
                image: [
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/2248`,
                    "/pictograms/isUsedFor.png",
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/26803`
                ]
            },
            {
                id: 12,
                phraseKey: "sea-beach",
                wordAudio: ["sea", "isIn", "beach"],
                image: [
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/2925`,
                    "/pictograms/isIn.png",
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/30518`
                ]
            },
            {
                id: 13,
                phraseKey: "spoon-eating",
                wordAudio: ["spoon", "isUsedFor", "eating"],
                image: [
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/2362`,
                    "/pictograms/isUsedFor.png",
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/6456`
                ]
            },
            {
                id: 14,
                phraseKey: "phone-calling",
                wordAudio: ["phone", "isUsedFor", "calling"],
                image: [
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/25269`,
                    "/pictograms/isUsedFor.png",
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/6518`
                ]
            },
            {
                id: 15,
                phraseKey: "money-buying",
                wordAudio: ["money", "isUsedFor", "buying"],
                image: [
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/4630`,
                    "/pictograms/isUsedFor.png",
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/6457`
                ]
            },
            {
                id: 16,
                phraseKey: "boat-sailing",
                wordAudio: ["boat", "isUsedFor", "sailing"],
                image: [
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/8714`,
                    "/pictograms/isUsedFor.png",
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/7170`
                ]
            },
            {
                id: 17,
                phraseKey: "pool-swimming",
                wordAudio: ["pool", "isUsedFor", "swimming"],
                image: [
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/30516`,
                    "/pictograms/isUsedFor.png",
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/6568`
                ]
            },
            {
                id: 18,
                phraseKey: "park-playing",
                wordAudio: ["park", "isUsedFor", "playing"],
                image: [
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/2859`,
                    "/pictograms/isUsedFor.png",
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/6537`
                ]
            },
            {
                id: 19,
                phraseKey: "story-reading",
                wordAudio: ["story", "isUsedFor", "reading"],
                image: [
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/2364`,
                    "/pictograms/isUsedFor.png",
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/7141`
                ]
            },
            {
                id: 20,
                phraseKey: "book-library",
                wordAudio: ["book", "isIn", "library"],
                image: [
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/25191`,
                    "/pictograms/isIn.png",
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/3065`
                ]
            },
            {
                id: 21,
                phraseKey: "fruit-fruitshop",
                wordAudio: ["fruit", "isIn", "fruitshop"],
                image: [
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/4653`,
                    "/pictograms/isIn.png",
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/3327`
                ]
            },
            {
                id: 22,
                phraseKey: "flower-garden",
                wordAudio: ["flower", "isIn", "garden"],
                image: [
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/7104`,
                    "/pictograms/isIn.png",
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/30608`
                ]
            },
            {
                id: 23,
                phraseKey: "zebra-savanna",
                wordAudio: ["zebra", "isIn", "savanna"],
                image: [
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/2324`,
                    "/pictograms/isIn.png",
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/5567`
                ]
            },
            {
                id: 24,
                phraseKey: "car-garage",
                wordAudio: ["car", "isIn", "garage"],
                image: [
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/2339`,
                    "/pictograms/isIn.png",
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/16975`
                ]
            },
            {
                id: 25,
                phraseKey: "fish-sea",
                wordAudio: ["fish", "isIn", "sea"],
                image: [
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/7252`,
                    "/pictograms/isIn.png",
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/38270`
                ]
            },
            {
                id: 26,
                phraseKey: "playground-school",
                wordAudio: ["playground", "isIn", "school"],
                image: [
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/33064`,
                    "/pictograms/isIn.png",
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/3082`
                ]
            },{
                id: 27,
                phraseKey: "mouth-teeth",
                wordAudio: ["mouth", "has", "teeth"],
                image: [
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/2663`,
                    "/pictograms/has.png",
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/2737`
                ]
            },
            {
                id: 28,
                phraseKey: "piano-keys",
                wordAudio: ["piano", "has", "keys"],
                image: [
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/2521`,
                    "/pictograms/has.png",
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/7270`
                ]
            },
            {
                id: 29,
                phraseKey: "bike-wheels",
                wordAudio: ["bike", "has", "wheels"],
                image: [
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/2277`,
                    "/pictograms/has.png",
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/6209`
                ]
            },
            {
                id: 30,
                phraseKey: "fish-scales",
                wordAudio: ["fish", "has", "scales"],
                image: [
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/2520`,
                    "/pictograms/has.png",
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/7085`
                ]
            },
            {
                id: 31,
                phraseKey: "elephant-trunk",
                wordAudio: ["elephant", "has", "trunk"],
                image: [
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/2372`,
                    "/pictograms/has.png",
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/7287`
                ]
            },
            {
                id: 32,
                phraseKey: "backpack-books",
                wordAudio: ["backpack", "has", "books"],
                image: [
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/2475`,
                    "/pictograms/has.png",
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/25191`
                ]
            },
            {
                id: 33,
                phraseKey: "hedgehog-spines",
                wordAudio: ["hedgehog", "has", "spines"],
                image: [
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/26829`,
                    "/pictograms/has.png",
                    `${process.env.REACT_APP_ARASAAC_URL}/pictograms/28016`
                ]
            },
        ]
    }
];
