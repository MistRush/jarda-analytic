export default class PanelManager {
    panels = [];

    add(panel) {
        this.panels.push(panel);
    }

    remove(panel) {
        const index = this.panels.indexOf(panel);

        if (index !== -1) {
            this.panels.splice(index, 1);
        }
    }
}