const usePayment = () => {

    const types = {
        TYPE_GOPAY: "gopay",
        TYPE_GOPAY_PAYPAL: "gopaypaypal",
        TYPE_GOPAY_APPLE_PAY: "gopayapplepay",
        TYPE_BANK: "bank",
        TYPE_COD: "cod",
        TYPE_CASH: "cash",
        TYPE_CSOB: "csob",
    };

    const getTypes = () => {
        return {
            [types.TYPE_GOPAY]: "GoPay",
            [types.TYPE_GOPAY_PAYPAL]: "GoPay - PayPal",
            [types.TYPE_GOPAY_APPLE_PAY]: "GoPay - ApplePay",
            [types.TYPE_CSOB]: "ČSOB",
            [types.TYPE_BANK]: "Bankovní převod",
            [types.TYPE_COD]: "Dobírka",
            [types.TYPE_CASH]: "Platba hotové",
        };
    };

    return {
        types,
        getTypes,
    };
};

export { usePayment };
