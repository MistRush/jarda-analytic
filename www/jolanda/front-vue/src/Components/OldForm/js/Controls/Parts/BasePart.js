export default class BasePart {
    constructor(type, attributes = {}) {
        this.type = type; // Typ části (např. 'label', 'input', 'div')
        this.attributes = attributes; // Objekt pro ukládání atributů
        this.content = ''; // Obsah elementu
        this.tag = null;
        this.html = null;
    }

    // Metoda pro nastavení atributu
    setAttribute(name, value) {
        this.attributes[name] = value;
        return this;
    }

    // Metoda pro získání hodnoty atributu
    getAttribute(name) {
        return this.attributes[name];
    }

    setAttributes(attributes) {
        this.attributes = attributes;
        return this;
    }

    getAttributes() {
        return this.attributes;
    }

    // Nastavení textového obsahu
    setText(text) {
        this.content = text;
        return this;
    }

    getText(text) {
        return this.content;
    }

    setTag(tag) {
        this.tag = tag;
        return this;
    }

    getTag() {
        return this.tag;
    }

    setHtml(html) {
        this.html = html;
        return this;
    }

    getHtml() {
        return this.html;
    }

    // Nastavení třídy CSS jako atributu
    setClass(className) {
        if(Array.isArray(className)){
            className = className.join(' ');
        }

        if (this.attributes.class) {
            this.attributes.class += ` ${className}`;
        } else {
            this.attributes.class = className;
        }
        return this;
    }

    addClass(className) {
        return this.setClass(className);
    }

    removeAttribute(name) {
        delete this.attributes[name];
        return this;
    }
}
