const useCurrency = () => {

    const currencies = {
        ID_CURRENCY_CZK: 1,
        ID_CURRENCY_EUR: 2,
    };

    const getCurrencies = () => {
        return {
            [currencies.ID_CURRENCY_CZK]: "Česká koruna",
            [currencies.ID_CURRENCY_EUR]: "Euro",
        };
    };

    return {
        currencies,
        getCurrencies,
    };
};

export { useCurrency };
