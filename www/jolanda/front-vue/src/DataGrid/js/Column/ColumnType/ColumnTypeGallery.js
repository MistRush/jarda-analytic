import { ColumnType } from "./ColumnType";
import { ColumnDef } from "../../Settings/ColumnDef";
import { h } from "vue";
import PhotoSwipe from "photoswipe";
import "photoswipe/style.css";

export class ColumnTypeGallery extends ColumnType {
    _format = ColumnDef.COLUMN_TYPE_GALLERY;
    _imagePath = null;

    constructor(column, setting) {
        super(column);

        this._imagePath = setting?.imagePath ?? null;
    }

    getImages() {
        return this.column.dataGrid._data
            .map((row, idx) => {
                if (!row || !row.hasOwnProperty(this.column.data) || !row[this.column.data]) {
                    return;
                }

                let imgPath = row[this.column.data];
                if (typeof this._imagePath === "function") {
                    imgPath = this._imagePath(row[this.column.data]);
                }

                return {
                    src: imgPath,
                    originalIndex: idx,
                };
            })
            .filter((item) => item && item.src);
    }

    render(data, onlyData = false, cell) {
        if (onlyData) {
            return data;
        }

        if (data) {
            let imgPath = data;
            if (typeof this._imagePath === "function") {
                imgPath = this._imagePath(data);
            }

            if (!imgPath) {
                return "";
            }

            const el = h("img", {
                src: imgPath,
                class: "max-w-full max-h-full m-auto cursor-pointer",
                onClick: () => {
                    this.openGallery(cell._row._position);
                },
            });

            return el;
        } else {
            return "";
        }

        return data;
    }

    openGallery(index) {
        const images = this.getImages();

        const imageIndex = images.findIndex((img) => img.originalIndex === index);

        if (imageIndex === -1) return; // fallback, obrázek nenalezen

        const gallery = new PhotoSwipe({
            dataSource: images.map((img) => ({ src: img.src })),
            index: imageIndex,
        });

        // gallery.on("contentLoad", (e) => {
        //     const { content } = e;
        //
        //     if (!content.isImageContent()) return;
        //
        //     const img = new Image();
        //     img.src = content.data.src;
        //
        //     img.onload = () => {
        //         debugger;
        //
        //         content.displayedImageHeight = 40;
        //         content.displayedImageWidth = 40;
        //
        //         content.slide.width = img.naturalWidth;
        //         content.slide.height = img.naturalHeight;
        //
        //         content.slide.prevDisplayedWidth = img.naturalWidth;
        //         content.slide.prevDisplayedHeight = img.naturalHeight;
        //
        //         content.width = img.naturalWidth;
        //         content.height = img.naturalHeight;
        //         if (content.state === "idle") {
        //             content.load();
        //         }
        //     };
        //
        //     img.onerror = () => {
        //         // fallback velikost
        //         content.width = 800;
        //         content.height = 600;
        //         if (content.state === "idle") {
        //             content.load();
        //         }
        //     };
        // });

        gallery.on("gettingData", (idx, item) => {
            if (!idx.width || !idx.height) {
                const img = new Image();
                img.src = idx.data.src;
                img.onload = () => {
                    idx.width = img.naturalWidth;
                    idx.height = img.naturalHeight;
                    if (gallery) {
                        gallery.refreshSlideContent(idx);
                    }
                };
                img.onerror = () => {
                    idx.width = 800;
                    idx.height = 600;
                    gallery?.refreshSlideContent(idx);
                };
            }
        });

        gallery.init();
    }

    get editor() {
        return null;
    }
}
