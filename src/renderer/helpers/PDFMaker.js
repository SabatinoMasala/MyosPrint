import PDFDocument from 'pdfkit'
import sharp from 'sharp'
import Promise from 'bluebird'
import fs from 'fs'
import Dir from '@/helpers/Dir'
const shell = require('electron').shell;

let FICHES = {
    classic: {
        c: require('@/printers/classic/c.json'),
        b: require('@/printers/classic/b.json'),
    },
    roll: {
        b: require('@/printers/roll/b.json'),
        c: require('@/printers/roll/c.json'),
    }
};

export default {
    addImage(doc, image, position, dimensions) {
        return new Promise((resolve, reject) => {
            if (position.rotation !== undefined) {
                sharp(image).rotate(position.rotation).toBuffer().then((data) => {
                    let width = dimensions.width;
                    let height = dimensions.height;

                    if (Math.abs(position.rotation) === 90) {
                        doc.image(data, {
                            width: height,
                            height: width,
                            x: position.x,
                            y: position.y
                        })
                    } else {
                        doc.image(data, {
                            width: width,
                            height: height,
                            x: position.x,
                            y: position.y
                        })
                    }

                    resolve()
                })
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
    makeNextPage(printer, pages, doc, size, index, createNewPageFirst, allDoneCallback) {
        let page = pages[index];
        if (!!createNewPageFirst) {
            doc.addPage();
        }
        let promises = [];
        Object.keys(page).forEach((part) => {
            page[part].forEach((image, index) => {
                if (FICHES[printer][size].slots[part] !== undefined) {
                    let position = FICHES[printer][size].slots[part][index];
                    let dimensions = FICHES[printer][size].dimensions[part];
                    promises.push(this.addImage(doc, image, position, dimensions))
                }
            })
        });
        Promise.all(promises).then(() => {
            if (pages.length - 1 > index) {
                this.makeNextPage(printer, pages, doc, size, index + 1, true, allDoneCallback)
            } else {
                allDoneCallback();
            }
        })
    },
    makePDF(store, pages, size, filename) {

        let printer = store.state.Settings.printer;
        let blankPages = store.state.Settings.pdf_blank_pages_before_labels;

        let pageSize = 'a3';
        if (FICHES[printer][size].size !== undefined) {
            pageSize = FICHES[printer][size].size;
        }
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
            this.makeNextPage(printer, pages, doc, size, 0, labelsNeedNewPage, () => {
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