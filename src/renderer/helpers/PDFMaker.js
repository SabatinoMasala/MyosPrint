import PDFDocument from 'pdfkit'
import sharp from 'sharp'
import Promise from 'bluebird'
import fs from 'fs'
import Dir from '@/helpers/Dir'
import FicheResolver from '@/helpers/FicheResolver'
const shell = require('electron').shell;

const PDFMaker = {
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

        const margin = position.info_margin;
        const image = data.image;

        const textArray = data.text;

        const {width, height} = dimensions;
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

                            } else {
                                doc.image(data, {
                                    width,
                                    height,
                                    x: position.x,
                                    y: position.y
                                });

                            }

                            if (needsInfo) {
                                if (position.info_position === 'bottom') {
                                    this.addText(doc, textArray, position.x, position.y + width + margin);
                                } else if (position.info_position === 'top') {
                                    this.addText(doc, textArray, position.x, position.y - height - margin);
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
        return Promise
            .all(promises)
            .then(() => {
                if (pages.length - 1 > index) {
                    this.makeNextPage(orientation, printer, pages, doc, size, index + 1, true, allDoneCallback)
                } else {
                    allDoneCallback();
                }
            })
    },
    addBlackmark(doc, newPage = false) {
        if (newPage) {
            doc.addPage();
        }
        this.currentFiche.blackmarks.forEach(blackmark => {
            doc.rect(blackmark.x, blackmark.y, blackmark.height, blackmark.width).fill('black');
        });
    },
    addBlackmarks(doc, amount) {
        for (let i = 0; i < amount; i++) {
            this.addBlackmark(doc, true);
        }
    },
    addBlanks(doc, amount) {
        for (let i = 0; i < amount; i++) {
            doc.addPage();
        }
    },
    makePDF(config, pages, size) {

        const {printer, pdfSettings, orientation, filename} = config;
        const blackmarkStartFirst = pdfSettings.blackmark_start_first;
        const blackmarkEndFirst = pdfSettings.blackmark_end_first;
        const blankPagesStart = pdfSettings.blank_pages_before_labels;
        const blankPagesEnd = pdfSettings.blank_pages_after_labels;
        const blackmarkPagesStart = pdfSettings.blackmark_pages_before_labels;
        const blackmarkPagesEnd = pdfSettings.blackmark_pages_after_labels;

        this.currentFiche = FicheResolver.getFiche(printer, size);

        let pageSize = this.currentFiche.size;

        let doc = new PDFDocument({
            margin: 0,
            autoFirstPage: false,
            size: pageSize
        });

        let labelsNeedNewPage = false;
        if (blackmarkStartFirst) {
            this.addBlackmarks(doc, blackmarkPagesStart);
            this.addBlanks(doc, blankPagesStart);
        } else {
            this.addBlanks(doc, blankPagesStart);
            this.addBlackmarks(doc, blackmarkPagesStart);
        }

        return new Promise((resolve, reject, onCancel) => {

            const pagePromise = this.makeNextPage(orientation, printer, pages, doc, size, 0, labelsNeedNewPage, () => {

                if (blackmarkEndFirst) {
                    this.addBlackmarks(doc, blackmarkPagesEnd);
                    this.addBlanks(doc, blankPagesEnd);
                } else {
                    this.addBlanks(doc, blankPagesEnd);
                    this.addBlackmarks(doc, blackmarkPagesEnd);
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

            onCancel(() => {
                console.warn('[pdfmaker] promise was cancelled');
                pagePromise.cancel();
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
};

export default PDFMaker;
