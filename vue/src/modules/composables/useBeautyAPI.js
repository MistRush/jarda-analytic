import { ref } from 'vue';
import axios from 'axios';

export const useBeautyAPI = () => {
    const isLoading = ref(false);
    const error = ref(null);

    const searchBeauty = async (query) => {
        if (query.length < 3) return [];

        isLoading.value = true;
        error.value = null;

        try {
            const response = await axios.get('https://world.openbeautyfacts.org/cgi/search.pl', {
                params: {
                    search_terms: query,
                    search_simple: 1,
                    action: 'process',
                    json: 1,
                    page_size: 25,
                }
            });

            return response.data.products.map(product => ({
                name: product.product_name || 'Bez názvu',
                brand: product.brands || '',
                categories: product.categories || '',
                ingredients: product.ingredients_text || ''
            }));
        } catch (err) {
            console.error('Error searching beauty products:', err);
            error.value = 'Nepodařilo se načíst data';
            return [];
        } finally {
            isLoading.value = false;
        }
    };

    return {
        searchBeauty,
        isLoading,
        error
    };
};