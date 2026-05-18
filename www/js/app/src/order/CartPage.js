class CartPage {
    constructor() {
        this.bindEvents();
    }

    bindEvents() {
        $(() => {
            $('.quantity').change((e) => {
                let $this = $(e.target);
                let productID = $this.data('product-id');
                let quantity = $this.val();
                let montage = $('.montage [data-product-id="' + productID + '"]').val();

                Cart.updateCart(productID, quantity, true, function(data) {
                    CartPage.updateCartPage(data);
                }, montage);
            });

            $('.remove-item').click((e) => {
                let productID = $(e.target).data('product-id');

                cart.deleteProduct(productID, function (data) {
                    let cartRow = '.item[data-product-id="' + productID + '"]';

                    $(cartRow).fadeOut(200, function () {
                        $(cartRow).remove();
                    });
                    CartPage.updateCartPage(data);
                });
            });

            $('#clearCartContent').click(async (e) => {
                await this.openCartClearConfirmationDialog('Smazání produktů z košíku', 'Opravdu chcete smazat obsah košíku?');
            });

            $('.montage').change((e) => {
                let $this = $(e.target);
                let productID = $this.data('product-id');
                let quantity = $('.count[data-product-id="' + productID + '"]').val();
                let montage = $(e.target).is(':checked');

                cart.updateCart(productID, quantity, true, null, montage);
            });

            this.initSimpleDropbox();
        });
    }

    static updateCartPage(data) {
        if (data.TotalCount == 0) {
            window.location.href = '/cart/empty/';
            return;
        }

        $('.summary-container .total-with-vat').html(data.TotalPriceWithVat);
        $('.summary-container .total-without-vat').html(data.TotalPriceWithoutVat);
        $('.summary-container .total-vat').html(data.TotalVat);
        $('.cart-summary .left-to-free-shipping').html(data.LeftToFreeShipping);
        $('#item-coupon').html(data.CouponItemHtml);


        $.each(data.cartItems, (k, v) => {
            var cartRow = '.item[data-product-id="' + v.Product_ID + '"]';

            $(cartRow + ' .count').val(v.Quantity);
            $(cartRow + ' .price').html(v.PriceWithVat);
            $(cartRow + ' .total-price').html(v.TotalPriceWithVat);
        });
    }

    async openCartClearConfirmationDialog(title, content)  {
        if (this.dialog) { this.dialog.close(); }


        this.dialog = new Dialog();
        this.dialog._title = title;
        this.dialog._modalClass = 'cart-clear-confirmation';
        await this.dialog.openFromUrl(projectVars.basePath + '/modal/cart-clear-confirmation', {title, content} );

    }

    initSimpleDropbox() {
        const dropzone = document.getElementById('dropzone');
        const fileInput = document.getElementById('fileInput');
        const importButton = document.getElementById('importButton');
        const fileInfo = document.getElementById('fileInfo');
        const fileName = document.getElementById('fileName');
        const fileSize = document.getElementById('fileSize');
        const fileRemove = document.getElementById('fileRemove');
        const errorMessage = document.getElementById('errorMessage');
        let selectedFile = null;

        dropzone.addEventListener('click', function() {
            fileInput.click();
        });

        importButton.style.display = 'none';

        fileInput.addEventListener('change', function() {
            if (this.files && this.files.length > 0) {
                const file = this.files[0];
                validateAndPreviewFile(file);
            }
        });

        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            dropzone.addEventListener(eventName, preventDefaults, false);
        });

        function preventDefaults(e) {
            e.preventDefault();
            e.stopPropagation();
        }

        ['dragenter', 'dragover'].forEach(eventName => {
            dropzone.addEventListener(eventName, highlight, false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            dropzone.addEventListener(eventName, unhighlight, false);
        });

        function highlight() {
            dropzone.classList.add('dragover');
        }

        function unhighlight() {
            dropzone.classList.remove('dragover');
            dropzone.classList.remove('error');
        }

        // Zpracování přetaženého souboru
        dropzone.addEventListener('drop', function(e) {
            const dt = e.dataTransfer;
            if (dt.files && dt.files.length > 0) {
                const file = dt.files[0];
                validateAndPreviewFile(file);
            }
        });

        // Import souboru po kliknutí na tlačítko importu
        importButton.addEventListener('click', function(e) {
            e.preventDefault();

            if (selectedFile) {
                // Zde provádíme samotný "import" souboru
                handleFileImport(selectedFile);
            } else {
                // Pokud není vybrán soubor, otevřeme dialog pro výběr
                fileInput.click();
            }
        });

        // Odstraní vybraný soubor
        fileRemove.addEventListener('click', function() {
            clearFile();
        });

        function validateAndPreviewFile(file) {
            // Kontrola, zda je soubor CSV
            const fileExtension = file.name.split('.').pop().toLowerCase();

            if (fileExtension === 'csv') {
                // Resetování chybových stavů
                hideError();

                // Uložení souboru a zobrazení náhledu
                selectedFile = file;
                previewFile(file);

                // Aktivace tlačítka importu
                importButton.style.display = 'block';
                importButton.classList.remove('disabled');
                importButton.parentElement.classList.remove('disabled');
            } else {
                // Zobrazení chyby
                showError();

                // Vyčištění výběru
                clearFile();
            }
        }

        // Zobrazení náhledu souboru
        function previewFile(file) {
            fileName.textContent = file.name;
            fileSize.textContent = formatFileSize(file.size);
            fileInfo.classList.add('has-file');
        }

        // Zpracování importu souboru
        function handleFileImport(file) {
            const formData = new FormData();
            formData.append('File', file);
            formData.append('Delimiter', $('#csvDelimiter').val());

            fetch('/cart/import-products-from-csv', {
                method: 'POST',
                body: formData
            })
                .then(response => response.json())
                .then(data => {
                    if (data.status === 'success') {
                        alerts.alert('Import dokončen', 'info',  data.message);
                            window.location.reload();
                    } else {
                        alerts.alert('Chyba', 'error',  data.error_message);
                    }
                })
                .catch(error => {
                    console.error('Chyba při importu:', error);
                    alerts.alert('Chyba', 'error', error);
                });


            // Po importu můžeme vyčistit formulář
            clearFile();
        }

        // Zobrazení chybové zprávy
        function showError() {
            alerts.alert('Upozornění', 'error', 'Prosím, vyberte platný CSV soubor.');
            errorMessage.classList.add('show');
            dropzone.classList.add('error');
            setTimeout(() => {
                errorMessage.classList.remove('show');
                dropzone.classList.remove('error');
            }, 3000);
        }

        // Skrytí chybové zprávy
        function hideError() {
            errorMessage.classList.remove('show');
            dropzone.classList.remove('error');
        }

        // Odstranění vybraného souboru
        function clearFile() {
            selectedFile = null;
            fileInput.value = '';
            fileInfo.classList.remove('has-file');
            hideError();
        }

        // Formátování velikosti souboru
        function formatFileSize(bytes) {
            if (bytes === 0) return '0 B';
            const k = 1024;
            const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
        }
    }

}