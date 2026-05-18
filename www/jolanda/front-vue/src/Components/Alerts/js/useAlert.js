import { reactive, useId } from "vue";

/**
 * @brief Vytvoří objekt alertu s členskými funkcemi a dodatečnými parametry
 * @param alertState Objekt s parametry alertu: objekt musí obsahovat **type**, **title** a **message**
 * @returns Objekt alertu, který je pak vložen do pole alertStore
 */

export function useAlert(alertState) {
    return reactive({
        id: useId(),
        type: alertState.type,
        title: alertState.title,
        message: alertState.message,
        createdAt: new Date().toTimeString().split(" ")[0],
        data: alertState.data,
        areDataShown: false,
        progress: null,
        options: {
            textTrusted: alertState.options?.textTrusted ?? false,
            titleTrusted: alertState.options?.titleTrusted ?? false,
        },
        toggleData() {
            this.areDataShown = !this.areDataShown;
        },
        changeToSuccess(header, text, jsonData) {
            this.changeAlertState("success", header, text, jsonData);
        },
        changeToInfo(header, text, jsonData) {
            this.changeAlertState("info", header, text, jsonData);
        },
        changeToWarning(header, text, jsonData) {
            this.changeAlertState("warning", header, text, jsonData);
        },
        changeToError(header, text, jsonData) {
            this.changeAlertState("danger", header, text, jsonData);
        },
        changeAlertState(type, header, text, jsonData = null) {
            this.type = type;
            this.title = header || this.title;
            this.message = text || this.message;
            if (jsonData) {
                this.data = jsonData;
            }
        },
        setProgress(percent) {
            this.progress = percent;
        },
    });
}
