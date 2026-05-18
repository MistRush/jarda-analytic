import axios from "axios";
import { useAlertStore } from "../Components/Alerts/stores/alertStore.js";
import { useApp } from "@/App/composables/useApp.js";

export function useAjax() {
    const alerts = window.pinia ? useAlertStore(window.pinia) : null;
    const { app } = useApp();

    async function request(method, url, data = null, config = null, options = null) {
        let hasError = false;

        let { alert } = _onBeforeRequest(options);

        let modifiedData = data;

        const mapBooleansToString = (obj) => {
            if (obj instanceof FormData) {
                return obj; // přeskočit FormData beze změny
            }

            if (Array.isArray(obj)) {
                return obj.map(mapBooleansToString);
            } else if (typeof obj === "object" && obj !== null) {
                const mapped = {};
                for (const [key, value] of Object.entries(obj)) {
                    if (value === true) {
                        mapped[key] = "1";
                    } else if (value === false) {
                        mapped[key] = "0";
                    } else {
                        mapped[key] = mapBooleansToString(value);
                    }
                }
                return mapped;
            } else {
                return obj;
            }
        };

        if (data && typeof data !== "FormData") {
            modifiedData = mapBooleansToString(modifiedData);
        }

        let props = {
            method,
            url,
            data: modifiedData,
            headers: {
                "Content-Type": "application/json",
            },
            ...config,
        };

        if (method === "get") {
            let modifiedConfig = config;
            if (config?.params) {
                modifiedConfig.params = mapBooleansToString(modifiedConfig.params);
            }

            props = {
                method,
                url,
                data: null,
                headers: {
                    "Content-Type": "application/json",
                },
                ...config,
            };
        }

        return axios(props)
            .then((response) => {
                handleSuccess(response); // Vlastní logika úspěchu
                const { data } = response;

                if (app) {
                    const jolandaBuildTime = response.headers["x-jolanda-build-time"] ?? null;

                    app.checkBuildVersion(jolandaBuildTime);
                }

                return { response, alert, data };
            })
            .catch((error) => {
                hasError = true;
                handleError(error); // Vlastní logika chyby
                throw { error, alert }; // Přehodíme chybu dál, aby ji mohli zachytit volající
            })
            .finally(() => {
                _onFinally(alert, hasError);
            });
    }

    async function get(url, config = null, options = null) {
        return request("get", url, null, config, options);
    }

    async function post(url, data = null, config = null, options = null) {
        return request("post", url, data, config, options);
    }

    async function put(url, data = null, config = null, options = null) {
        return request("put", url, data, config, options);
    }

    async function patch(url, data = null, config = null, options = null) {
        return request("patch", url, data, config, options);
    }

    async function postForm(url, data = null, config = null, options = null) {
        const conf = {
            method: "POST",
            headers: {
                "Content-Type": "multipart/form-data",
            },
            ...config,
        };

        // Automatická detekce souborů a vytvoření FormData
        if (data && typeof data === "object" && !(data instanceof FormData)) {
            const formData = new FormData();
            Object.entries(data).forEach(([key, value]) => {
                if (Array.isArray(value)) {
                    value.forEach((item, index) => {
                        if (item instanceof File || item instanceof Blob) {
                            formData.append(`${key}[${index}]`, item);
                        } else {
                            if (item === true) {
                                formData.append(`${key}[${index}]`, "1");
                            } else if (item === false) {
                                formData.append(`${key}[${index}]`, "0");
                            } else {
                                formData.append(`${key}[${index}]`, item);
                            }
                        }
                    });
                } else if (value instanceof File || value instanceof Blob) {
                    formData.append(key, value);
                } else {
                    if (value === true) {
                        formData.append(key, "1");
                    } else if (value === false) {
                        formData.append(key, "0");
                    } else {
                        formData.append(key, value);
                    }
                }
            });

            data = formData;
        }

        return request("postForm", url, data, conf, options);
    }

    async function putForm(url, data = null, config = null, options = null) {
        const conf = {
            method: "POST",
            headers: {
                "Content-Type": "multipart/form-data",
            },
            ...config,
        };

        return request("putForm", url, data, conf, options);
    }

    async function patchForm(url, data = null, config = null, options = null) {
        const conf = {
            method: "POST",
            headers: {
                "Content-Type": "multipart/form-data",
            },
            ...config,
        };

        return request("patchForm", url, data, conf, options);
    }

    function handleSuccess(response) {}

    function handleError(error) {}

    function _onFinally(alert, hasError) {
        if (alert && alert.type.value === "waiting") {
            if (hasError) {
                alert.changeToError();
            } else {
                alert.changeToSuccess();
            }
        }
    }

    function _onBeforeRequest(options) {
        let alert = null;
        if (options) {
            if (options.waitingAlert && alerts) {
                if (typeof options.waitingAlert === "object") {
                    const { title, message, data, duration } = options.waitingAlert;
                    alert = alerts.waiting(title, message, data, duration);
                } else {
                    alert = alerts.waiting("Čekám na odpověd");
                }
            }
        }

        return { alert };
    }

    async function downloadFile(url, config = {}, options = {}) {
        let hasError = false;
        const { alert } = _onBeforeRequest(options);

        const props = {
            method: "get",
            url,
            responseType: "blob",
            onDownloadProgress: (progressEvent) => {
                if (alert && progressEvent.lengthComputable) {
                    const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    alert.setProgress(percent);
                }
            },
            ...config,
        };

        return axios(props)
            .then((response) => {
                handleSuccess(response);

                // vytvoření odkazu pro stažení souboru
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement("a");

                // název souboru z hlavičky nebo fallback
                let filename = "soubor";
                if (options.filename) {
                    filename = options.filename;
                } else {
                    const disposition = response.headers["content-disposition"];
                    const matches = disposition && disposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
                    if (matches && matches[1]) {
                        filename = matches[1].replace(/['"]/g, "");
                    }
                }

                link.href = url;
                link.setAttribute("download", filename);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);

                return { response, alert };
            })
            .catch((error) => {
                hasError = true;
                handleError(error);
                throw { error, alert };
            })
            .finally(() => {
                _onFinally(alert, hasError);
            });
    }

    // TODO delete metoda

    return {
        request,
        get,
        post,
        put,
        patch,
        postForm,
        putForm,
        patchForm,
        downloadFile,
    };
}
