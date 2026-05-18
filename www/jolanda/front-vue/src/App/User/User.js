export default class User {
    id = null;
    email = null;

    constructor(settings) {
        this.id = settings.ID;
        this.email = settings.Name;

        Object.entries(settings).forEach(([key, value]) => {
            this[key] = value;
        });
    }
}
