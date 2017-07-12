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
                let buffer = sharp(image).rotate(position.rotation).toBuffer().then((data) => {
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
    makePDF() {

        let doc = new PDFDocument({
            margin: 0,
            size: 'a3'
        });

        let fiches = [
            {
                front: [
                    Dir.getImagesDir() + '/1.png',
                    Dir.getImagesDir() + '/1.png',
                    Dir.getImagesDir() + '/1.png',
                    Dir.getImagesDir() + '/1.png',
                    Dir.getImagesDir() + '/1.png',
                ],
                back: [
                    Dir.getImagesDir() + '/3.png',
                    Dir.getImagesDir() + '/3.png',
                    Dir.getImagesDir() + '/3.png',
                    Dir.getImagesDir() + '/3.png',
                    Dir.getImagesDir() + '/3.png',
                ],
                neck: [
                    Dir.getImagesDir() + '/2.png',
                    Dir.getImagesDir() + '/2.png',
                    Dir.getImagesDir() + '/2.png',
                    Dir.getImagesDir() + '/2.png',
                    Dir.getImagesDir() + '/2.png',
                ]
            },
            {
                front: [
                    Dir.getImagesDir() + '/1.png',
                    Dir.getImagesDir() + '/1.png',
                    Dir.getImagesDir() + '/1.png',
                    Dir.getImagesDir() + '/1.png',
                    Dir.getImagesDir() + '/1.png',
                ],
                back: [
                    Dir.getImagesDir() + '/3.png',
                    Dir.getImagesDir() + '/3.png',
                    Dir.getImagesDir() + '/3.png',
                    Dir.getImagesDir() + '/3.png',
                    Dir.getImagesDir() + '/3.png',
                ],
                neck: [
                    Dir.getImagesDir() + '/2.png',
                    Dir.getImagesDir() + '/2.png',
                    Dir.getImagesDir() + '/2.png',
                    Dir.getImagesDir() + '/2.png',
                    Dir.getImagesDir() + '/2.png',
                ]
            }];

        let promises = [];

        fiches.forEach((fiche, index) => {
            if (index > 0) {
                doc.addPage();
            }
            Object.keys(fiche).forEach((part) => {
                fiche[part].forEach((image, index) => {
                    let position = fiche_c.slots[part][index];
                    let dimensions = fiche_c.dimensions[part];
                    promises.push(this.addImage(doc, image, position, dimensions))
                })
            });
        });

        return new Promise((resolve, reject) => {
            Promise.all(promises).then(() => {
                let path = Dir.getPDFDir() + '/file.pdf';
                let file = fs.createWriteStream(path);
                doc.pipe(file);
                doc.end();
                file.on('finish', () => {
                    shell.openItem(path);
                    resolve();
                })
            })
        })
    }
}