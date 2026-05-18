const useVat = () => {

    const vats = {
        ID_VAT_21: 1,
        ID_VAT_20: 2,
        ID_VAT_15: 3,
        ID_VAT_10: 4,
        ID_VAT_0: 5
    };

    const vatCountTypes = {
        VAT_COUNT_TYPE_WITHOUT: "without-vat",
        VAT_COUNT_TYPE_WITH: "with-vat"
    };

    const getVats = () => {
        return {
            [vats.ID_VAT_21]: "Základní daň 21%",
            [vats.ID_VAT_20]: "Základní daň 20%",
            [vats.ID_VAT_15]: "Základní daň 15%",
            [vats.ID_VAT_10]: "Základní daň 10%",
            [vats.ID_VAT_0]: "Nulová daň",
        };
    };

    const getVatCountTypes = () => {
        return {
            [vatCountTypes.VAT_COUNT_TYPE_WITHOUT]: "uvedená cena je bez DPH",
            [vatCountTypes.VAT_COUNT_TYPE_WITH]: "uvedená cena je s DPH",
        };
    };

    return {
        vats,
        vatCountTypes,
        getVats,
        getVatCountTypes
    };
};

export { useVat };
