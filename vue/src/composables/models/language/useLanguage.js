const useLanguage = () => {

    const languages = {
        ID_LANGUAGE_CZ: 1,
        ID_LANGUAGE_SK: 2,
    };

    const getLanguages = () => {
        return {
            [languages.ID_LANGUAGE_CZ]: "čeština",
            [languages.ID_LANGUAGE_SK]: "slovenština",
        };
    };

    return {
        languages,
        getLanguages,
    };
};

export { useLanguage };
