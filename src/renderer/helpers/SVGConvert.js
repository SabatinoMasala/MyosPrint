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