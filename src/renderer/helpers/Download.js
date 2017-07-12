import Dir from '@/helpers/Dir'
import https from 'https'
import Promise from 'bluebird'
import fs from 'fs'

export default {
    downloadSVGFromLabel(label) {
        let downloads = [];
        if (label.frontLabelSVG) {
            downloads.push(this.download(label.frontLabelSVG));
        }
        if (label.backLabelSVG) {
            downloads.push(this.download(label.backLabelSVG));
        }
        if (label.neckLabelSVG) {
            downloads.push(this.download(label.neckLabelSVG));
        }
        return downloads;
    },
    download(url) {
        return new Promise((resolve, reject) => {
            let regex = /[^\/]+\.svg/;
            let dest = Dir.getSVGDir() + '/' + regex.exec(url)[0];
            if (fs.existsSync( dest )) {
                return resolve();
            }
            let file = fs.createWriteStream(dest);
            https.get(url, function(response) {
                response.pipe(file);
                file.on('finish', function() {
                    file.close(() => {
                        resolve();
                    });
                });
            }).on('error', function(err) {
                fs.unlink(dest);
                reject();
            });
        })
    }
}