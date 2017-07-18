import Dir from '@/helpers/Dir'
import Promise from 'bluebird'
import fs from 'fs'
import svg2png from 'svg2png'
import {svg2PngFiles} from 'svg2png-many'
import svgtool from 'svg-tool'
import _ from 'lodash'
import DownloadConversionProgress from '@/store/DownloadConversionProgress'
import log from 'electron-log';

let count = 0;

export default {
    convertAll(labels) {
        console.time('conversion');
        let total = 0;
        let files = [];
        labels.forEach((label) => {
            if (label.frontLabelSVG && label.frontLabelSVG !== '') {
                total += 1;
                files.push(label.frontLabelSVG);
            }
            if (label.backLabelSVG && label.backLabelSVG !== '') {
                total += 1;
                files.push(label.backLabelSVG);
            }
            if (label.neckLabelSVG && label.neckLabelSVG !== '') {
                total += 1;
                files.push(label.neckLabelSVG);
            }
        });
        files = files.map((url) => {
            let regex = /[^\/]+\.svg/;
            return Dir.getSVGDir() + '/' + regex.exec(url)[0];
        });
        files = files.filter((file) => {
            let destFile = file.replace('/svg/', '/images/').replace('.svg', '.png');
            return !fs.existsSync( destFile );
        });
        let filemap = {};
        files.forEach((file) => {
            filemap[file] = file.replace('/svg/', '/images/').replace('.svg', '.png');
        });
        DownloadConversionProgress.totalConversions = total;

        return new Promise((resolve, reject) => {
            if (Object.keys(filemap).length > 0) {
                svg2PngFiles(filemap, {
                    width: 1000
                }).then(() => {
                    resolve();
                });
            } else {
                resolve();
            }
        });
        // return new Promise((resolve, reject) => {
        //     this.convertNextBatch(0, _.chunk(labels, 5), () => {
        //         console.timeEnd('conversion');
        //         resolve();
        //     })
        // })
    },
    convertNextBatch(index, chunks, callback) {
        let promises = [];
        chunks[index].forEach((label) => {
            promises.push( Promise.all(this.convertLabelSVGToPNG(label)) )
        });
        Promise.all(promises).then(() => {
            if (chunks.length - 1 > index) {
                this.convertNextBatch(index + 1, chunks, callback)
            } else {
                callback();
            }
        });
    },
    convertLabelSVGToPNG(label) {
        let conversions = [];
        if (label.frontLabelSVG && label.frontLabelSVG !== '') {
            conversions.push(this.convert(label.frontLabelSVG));
        }
        if (label.backLabelSVG && label.backLabelSVG !== '') {
            conversions.push(this.convert(label.backLabelSVG));
        }
        if (label.neckLabelSVG && label.neckLabelSVG !== '') {
            conversions.push(this.convert(label.neckLabelSVG));
        }
        return conversions;
    },
    convert(url) {
        return new Promise((resolve, reject) => {
            let regex = /[^\/]+\.svg/;
            let file = regex.exec(url)[0];
            let src = Dir.getSVGDir() + '/' + file;
            let dest = Dir.getImagesDir() + '/' + file.replace('.svg', '.png');
            if (!fs.existsSync( src )) {
                return reject();
            }
            if (fs.existsSync( dest )) {
                DownloadConversionProgress.conversions++;
                return resolve();
            }

            // let buffer = fs.readFileSync(src);
            let num = ++count;
            console.log('converting');
            svgtool(src, dest, 2, function() {
                resolve();
            })
            // svg2png(buffer, { width: 1000 }).then((buffer) => {
            //     fs.writeFileSync(dest, buffer);
            //     DownloadConversionProgress.conversions++;
            //     resolve();
            // }).catch((e) => {
            //     reject();
            // });

        })
    }
}

/*

 import Dir from '@/helpers/Dir'
 import Promise from 'bluebird'
 import fs from 'fs'
 import svg2png from 'svg2png'
 import svgtool from 'svg-tool'
 import _ from 'lodash'
 import DownloadConversionProgress from '@/store/DownloadConversionProgress'
 import log from 'electron-log';

 let count = 0;

 export default {
 convertAll(labels) {
 console.time('conversion');
 let total = 0;
 labels.forEach((label) => {
 if (label.frontLabelSVG && label.frontLabelSVG !== '') {
 total += 1;
 }
 if (label.backLabelSVG && label.backLabelSVG !== '') {
 total += 1;
 }
 if (label.neckLabelSVG && label.neckLabelSVG !== '') {
 total += 1;
 }
 });
 DownloadConversionProgress.totalConversions = total;
 return new Promise((resolve, reject) => {
 this.convertNextBatch(0, _.chunk(labels, 5), () => {
 console.timeEnd('conversion');
 resolve();
 })
 })
 },
 convertNextBatch(index, chunks, callback) {
 let labels = [];
 chunks[index].forEach((label) => {
 if (label.frontLabelSVG && label.frontLabelSVG !== '') {
 labels.push(label.frontLabelSVG);
 }
 if (label.backLabelSVG && label.backLabelSVG !== '') {
 labels.push(label.backLabelSVG);
 }
 if (label.neckLabelSVG && label.neckLabelSVG !== '') {
 labels.push(label.neckLabelSVG);
 }
 });
 this.convertNew(labels).then(() => {
 if (chunks.length - 1 > index) {
 this.convertNextBatch(index + 1, chunks, callback)
 } else {
 callback();
 }
 });
 },
 convertLabelSVGToPNG(label) {
 let urls = [];
 if (label.frontLabelSVG && label.frontLabelSVG !== '') {
 urls.push(label.frontLabelSVG);
 }
 if (label.backLabelSVG && label.backLabelSVG !== '') {
 urls.push(label.backLabelSVG);
 }
 if (label.neckLabelSVG && label.neckLabelSVG !== '') {
 urls.push(label.neckLabelSVG);
 }
 return this.convertNew(urls);
 },
 convertNew(srcs) {
 return new Promise((resolve, reject) => {
 let regex = /[^\/]+\.svg/;
 let dests = srcs.map((url) => {
 let file = regex.exec(url)[0];
 return Dir.getImagesDir() + '/' + file.replace('.svg', '.png');
 });
 srcs = srcs.map((url) => {
 let file = regex.exec(url)[0];
 return Dir.getSVGDir() + '/' + file;
 });
 if (srcs.length === 0) {
 return resolve();
 }
 svgtool(srcs, dests, 2, function() {
 resolve();
 })
 })
 },
 convert(url) {
 return new Promise((resolve, reject) => {
 let regex = /[^\/]+\.svg/;
 let file = regex.exec(url)[0];
 let src = Dir.getSVGDir() + '/' + file;
 let dest = Dir.getImagesDir() + '/' + file.replace('.svg', '.png');
 if (!fs.existsSync( src )) {
 return reject();
 }
 if (fs.existsSync( dest )) {
 DownloadConversionProgress.conversions++;
 return resolve();
 }

 let buffer = fs.readFileSync(src);
 let num = ++count;
 console.log('converting');
 svg2png(buffer, { width: 1000 }).then((buffer) => {
 fs.writeFileSync(dest, buffer);
 DownloadConversionProgress.conversions++;
 resolve();
 }).catch((e) => {
 reject();
 });

 })
 }
 }

*/