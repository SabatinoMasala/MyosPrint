import PDFDocument from 'pdfkit'
import sharp from 'sharp'
import Promise from 'bluebird'
import fs from 'fs'
import Dir from '@/helpers/Dir'
import fiche_c from '@/printers/classic/c.json'
const shell = require('electron').shell;

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
    makeNextPage(pages, doc, index, createNewPageFirst, allDoneCallback) {
        let page = pages[index];
        if (!!createNewPageFirst) {
            doc.addPage();
        }
        let promises = [];
        Object.keys(page).forEach((part) => {
            page[part].forEach((image, index) => {
                let position = fiche_c.slots[part][index];
                let dimensions = fiche_c.dimensions[part];
                promises.push(this.addImage(doc, image, position, dimensions))
            })
        });
        Promise.all(promises).then(() => {
            if (pages.length - 1 > index) {
                this.makeNextPage(pages, doc, index + 1, true, allDoneCallback)
            } else {
                allDoneCallback();
            }
        })
    },
    makePDF(pages) {

        let doc = new PDFDocument({
            margin: 0,
            size: 'a3'
        });

        return new Promise((resolve, reject) => {
            this.makeNextPage(pages, doc, 0, false, () => {
                let path = Dir.getPDFDir() + '/file.pdf';
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