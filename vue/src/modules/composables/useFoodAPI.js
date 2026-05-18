import { ref } from 'vue';
import axios from 'axios';

let offDebounceTimer = null;

export const useFoodAPI = () => {
    const isLoading = ref(false);
    const isLoadingOFF = ref(false);
    const error = ref(null);
    const searchResults = ref([]);

    const searchFood = async (query) => {

        if (query.length < 3) {
            searchResults.value = [];
            return;
        }

        isLoading.value = true;
        error.value = null;
        searchResults.value = [];

        try {
            const dbResponse = await axios.get('/meal/search-food', {
                params: { query },
                timeout: 3000
            });


            let dbData = [];
            if (Array.isArray(dbResponse.data)) {
                dbData = dbResponse.data;
            } else if (dbResponse.data.data && Array.isArray(dbResponse.data.data)) {
                dbData = dbResponse.data.data;
            }

            const dbResults = dbData.map(item => ({
                ...item,
                source: 'database'
            }));

            searchResults.value = dbResults;


            if (offDebounceTimer) clearTimeout(offDebounceTimer);

            offDebounceTimer = setTimeout(async () => {
                await searchOpenFoodFacts(query);
            }, 800);

        } catch (err) {
        } finally {
            isLoading.value = false;
        }
    };

    const searchOpenFoodFacts = async (query) => {
        isLoadingOFF.value = true;

        try {
            const offResponse = await axios.get('https://world.openfoodfacts.org/cgi/search.pl', {
                params: {
                    search_terms: query,
                    search_simple: 1,
                    action: 'process',
                    json: 1,
                    page_size: 5
                },
                timeout: 20000,
                headers: {
                    'Accept': 'application/json'
                }
            });


            if (!offResponse.data.products) {
                return;
            }

            const validProducts = offResponse.data.products.filter(product =>
                product.product_name &&
                product.nutriments &&
                Object.keys(product.nutriments).length > 0
            );

            const offResults = validProducts.map(product => ({
                name: product.product_name.trim() || 'Bez názvu',
                brand: product.brands || '',
                barcode: product.code || '',
                nutrients: {
                    energy_kcal: product.nutriments['energy-kcal_100g'] ||
                        product.nutriments['energy-kcal'] ||
                        (product.nutriments['energy'] ? product.nutriments['energy'] / 4.184 : 0),
                    proteins: product.nutriments.proteins_100g || 0,
                    carbohydrates: product.nutriments.carbohydrates_100g || 0,
                    fat: product.nutriments.fat_100g || 0,
                    fiber: product.nutriments.fiber_100g || 0,
                    salt: product.nutriments.salt_100g || 0,
                    sugars: product.nutriments.sugars_100g || 0
                },
                source: 'openfoodfacts'
            }));

            if (offResults.length > 0) {
                searchResults.value = [...searchResults.value, ...offResults];
            }

        } catch (err) {
            console.warn('⚠️ OpenFoodFacts search failed:', err.message);
        } finally {
            isLoadingOFF.value = false;
        }
    };

    const cancelSearch = () => {
        if (offDebounceTimer) {
            clearTimeout(offDebounceTimer);
            offDebounceTimer = null;
        }
        isLoading.value = false;
        isLoadingOFF.value = false;
    };

    return {
        searchFood,
        searchResults,
        isLoading,
        isLoadingOFF,
        error,
        cancelSearch
    };
};