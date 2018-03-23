import PDFDocument from 'pdfkit'
import sharp from 'sharp'
import Promise from 'bluebird'
import fs from 'fs'
import Dir from '@/helpers/Dir'
import FicheResolver from '@/helpers/FicheResolver'
const shell = require('electron').shell;

export default {
    addText(doc, textArray, x, y) {
        textArray.forEach((text, index) => {
            if (index === 0) {
                doc.text(text, x, y);
            } else {
                doc.text(text);
            }
        });
    },
    addImage(doc, data, position, dimensions, needsInfo, size, orientation) {

        let margin = 5;
        let image = data.image;

        let textArray = data.text;

        let width = dimensions.width;
        let height = dimensions.height;
        let printerRotation = 0;
        if (size !== 'neck' && orientation === 'tl') {
            printerRotation = 180;
        }

        return new Promise((resolve, reject) => {
            if (position.rotation !== undefined) {
                if (image !== false) {
                    sharp(image)
                        .rotate(position.rotation + printerRotation)
                        .toBuffer()
                        .then((data) => {

                            if (Math.abs(position.rotation) === 90) {
                                doc.image(data, {
                                    width: height,
                                    height: width,
                                    x: position.x,
                                    y: position.y
                                });

                                if (needsInfo) {
                                    this.addText(doc, textArray, position.x, position.y + width + margin);
                                }

                            } else {
                                doc.image(data, {
                                    width: width,
                                    height: height,
                                    x: position.x,
                                    y: position.y
                                });

                                if (needsInfo) {
                                    this.addText(doc, textArray, position.x, position.y + width + margin);
                                }

                            }

                            resolve()
                        })
                        .catch(error => {
                            resolve();
                        })
                } else {
                    if (needsInfo) {
                        this.addText(doc, textArray, position.x, position.y + width + margin);
                    }
                    resolve();
                }
            } else {
                doc.image(image, {
                    width: dimensions.width,
                    height: dimensions.height,
                    x: position.x,
                    y: position.y
                });
                resolve()
            }
        })
    },

    // This needs to be a recursive function instead of a for-loop because of race conditions with page creation
    makeNextPage(orientation, printer, pages, doc, size, index, createNewPageFirst, allDoneCallback) {

        doc.fontSize(7);

        let needsInfo = false;
        if (this.currentFiche.settings) {
            needsInfo = !!this.currentFiche.settings.info;
        }

        let page = pages[index];
        if (!!createNewPageFirst) {
            doc.addPage();
        }
        let promises = [];
        Object.keys(page).forEach((part) => {
            page[part].forEach((data, index) => {
                if (this.currentFiche.slots[part] !== undefined) {
                    let position = this.currentFiche.slots[part][index];
                    let dimensions = this.currentFiche.dimensions[part];
                    promises.push(this.addImage(doc, data, position, dimensions, needsInfo, size, orientation))
                }
            })
        });
        Promise.all(promises).then(() => {
            if (pages.length - 1 > index) {
                this.makeNextPage(orientation, printer, pages, doc, size, index + 1, true, allDoneCallback)
            } else {
                allDoneCallback();
            }
        })
    },
    makePDF(store, pages, size, filename) {

        const printer = store.state.Settings.printer;
        const blankPages = store.state.Settings.pdf_blank_pages_before_labels;
        const orientation = store.state.Settings.orientation;

        this.currentFiche = FicheResolver.getFiche(printer, size);

        let pageSize = this.currentFiche.size;

        let doc = new PDFDocument({
            margin: 0,
            size: pageSize
        });

        let labelsNeedNewPage = false;
        if (blankPages !== 0) {
            for (let i = 0; i < blankPages; i++) {
                doc.addPage();
            }
        }

        return new Promise((resolve, reject) => {
            this.makeNextPage(orientation, printer, pages, doc, size, 0, labelsNeedNewPage, () => {
                let path = Dir.getPDFDir() + '/' + filename;
                if (size !== 'neck') {
                    path += '_' + orientation;
                }
                path +=  '.pdf';
                let file = fs.createWriteStream(path);
                doc.pipe(file);
                doc.end();
                file.on('finish', () => {
                    shell.openItem(path);
                    resolve();
                })
            });
        });
    },
    makeSamplePage(template, doc, callback) {
        Object.keys(template.slots).forEach((part) => {
            let slots = template.slots[part];
            slots.forEach((slot) => {
                let dimensions = template.dimensions[part];
                if (slot.rotation === 90) {
                    doc.rect(slot.x, slot.y, dimensions.height, dimensions.width)
                        .fill('gray');
                } else {
                    doc.rect(slot.x, slot.y, dimensions.width, dimensions.height)
                        .fill('gray');
                }
            })
        });
        callback();
    },
    makeSamplePDF(template, filename = 'sample.pdf') {

        let doc = new PDFDocument({
            margin: 0,
            size: template.size
        });

        return new Promise((resolve, reject) => {
            this.makeSamplePage(template, doc, () => {
                let path = Dir.getPDFDir() + '/' + filename + '.pdf';
                let file = fs.createWriteStream(path);
                doc.pipe(file);
                doc.end();
                file.on('finish', () => {
                    shell.openItem(path);
                    resolve();
                })
            });
        });
    }
}