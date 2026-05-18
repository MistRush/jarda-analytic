export default class Mapper {
    // Základní metoda pro mapování JSON dat na objekt, necháme ji prázdnou pro další rozšíření
    static map(jsonData) {
        throw new Error('The "map" method should be implemented in derived classes.');
    }

    // Pomocná metoda pro kontrolu, zda objekt má všechny potřebné vlastnosti
    static validateRequiredProperties(jsonData, requiredProperties) {
        requiredProperties.forEach(prop => {
            if (!(prop in jsonData)) {
                throw new Error(`Missing required property: ${prop}`);
            }
        });
    }

    // Pomocná metoda pro vytváření instancí na základě JSON dat
    static createInstance(ClassType, jsonData) {
        const instance = new ClassType();
        return this.map(jsonData, instance);
    }
}
