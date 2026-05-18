class CartPrompt {
    static addedToCart() {
        let addToCartDialog = {
            state0: {
                title: 'Produkt byl přidán do košíku',
                html: 'Děkujeme Vám, za Váš zájem o naše služby.<br>Nyní můžete pokračovat v nákupu, nebo přejít k objednávce.',
                buttons: {"Pokračujte v nakupování": 1, "Nákupní košík": 2},
                submit: (e, v, m, f) => {
                    e.preventDefault();
                    if (v == 1)
                        $.prompt.close();
                    else
                        document.location.href = '/cart/';
                }
            }
        };
        $.prompt(addToCartDialog);
    }
}