import Dir from '@/helpers/Dir'
import Promise from 'bluebird'
import fs from 'fs'
import svg2png from 'svg2png'

export default {
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
                console.log('file does not exist');
                return reject();
            }
            if (fs.existsSync( dest )) {
                console.log('file already converted');
                return resolve();
            }

            let buffer = fs.readFileSync(src);
            svg2png(buffer, { width: 1000 }).then((buffer) => {
                fs.writeFileSync(dest, buffer);
                resolve();
            }).catch((e) => {
                reject();
            });

        })
    }
}