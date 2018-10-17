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
        doc.addPage();

        let needsInfo = false;
        if (this.currentFiche.settings) {
            needsInfo = !!this.currentFiche.settings.info;
        }

        let page = pages[index];
        let promises = [];
        Object.keys(page).forEach((part) => {
            const pagePromises = [];
            page[part].forEach((data, index) => {
                if (this.currentFiche.slots[part] !== undefined) {
                    const position = this.currentFiche.slots[part][index];
                    const dimensions = this.currentFiche.dimensions[part];
                    const imagePromise = this.addImage(doc, data, position, dimensions, needsInfo, size, orientation);
                    promises.push(imagePromise);
                    pagePromises.push(imagePromise);
                }
            });
            Promise
                .all(pagePromises)
                .then(() => {
                    if (printer === 'blackmark') {
                        this.addBlackmark(doc);
                    }
                });
        });
        Promise.all(promises).then(() => {
            if (pages.length - 1 > index) {
                this.makeNextPage(orientation, printer, pages, doc, size, index + 1, true, allDoneCallback)
            } else {
                allDoneCallback();
            }
        })
    },
    addBlackmark(doc, newPage = false) {
        const blackmark = this.currentFiche.blackmark;
        if (newPage) {
            doc.addPage();
        }
        doc.rect(blackmark.x, blackmark.y, blackmark.height, blackmark.width).fill('black');
    },
    makePDF(store, pages, size, filename) {

        const printer = store.state.Settings.printer;
        const pdfSettings = store.state.Settings.pdf_settings[size];
        const blankPagesStart = pdfSettings.blank_pages_before_labels;
        const blankPagesEnd = pdfSettings.blank_pages_after_labels;
        const blackmarkPagesStart = pdfSettings.blackmark_pages_before_labels;
        const blackmarkPagesEnd = pdfSettings.blackmark_pages_after_labels;
        const orientation = store.state.Settings.orientation;

        this.currentFiche = FicheResolver.getFiche(printer, size);

        let pageSize = this.currentFiche.size;

        let doc = new PDFDocument({
            margin: 0,
            autoFirstPage: false,
            size: pageSize
        });

        let labelsNeedNewPage = false;
        if (blankPagesStart !== 0) {
            for (let i = 0; i < blankPagesStart; i++) {
                doc.addPage();
            }
        }

        if (blackmarkPagesStart !== 0) {
            for (let i = 0; i < blackmarkPagesStart; i++) {
                this.addBlackmark(doc, true);
            }
        }

        return new Promise((resolve, reject) => {
            this.makeNextPage(orientation, printer, pages, doc, size, 0, labelsNeedNewPage, () => {

                if (blackmarkPagesEnd !== 0) {
                    for (let i = 0; i < blackmarkPagesEnd; i++) {
                        this.addBlackmark(doc, true);
                    }
                }

                if (blankPagesEnd !== 0) {
                    for (let i = 0; i < blankPagesEnd; i++) {
                        doc.addPage();
                    }
                }

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