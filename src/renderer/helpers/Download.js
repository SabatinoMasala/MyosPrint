import Dir from '@/helpers/Dir'
import https from 'https'
import Promise from 'bluebird'
import fs from 'fs'
import DownloadConversionProgress from '@/store/DownloadConversionProgress'

export default {
    downloadSVGFromLabel(label) {
        let downloads = [];
        if (label.frontLabelSVG && label.frontLabelSVG !== '') {
            downloads.push(this.downloadSVG(label.frontLabelSVG));
        } else {
            downloads.push(this.downloadImage(label.frontLabelImage));
        }
        if (label.backLabelSVG && label.backLabelSVG !== '') {
            downloads.push(this.downloadSVG(label.backLabelSVG));
        } else {
            downloads.push(this.downloadImage(label.backLabelImage));
        }
        if (label.neckLabelSVG && label.neckLabelSVG !== '') {
            downloads.push(this.downloadSVG(label.neckLabelSVG));
        } else {
            if (label.neckLabelImage !== '') {
                downloads.push(this.downloadImage(label.neckLabelImage));
            }
        }
        return downloads;
    },
    downloadImage(url) {
        DownloadConversionProgress.totalDownloads += 1;
        return new Promise((resolve, reject) => {
            let regex = /[^\/]+\.png/;
            let dest = Dir.getImagesDir() + '/' + regex.exec(url)[0];
            if (fs.existsSync( dest )) {
                DownloadConversionProgress.downloads++;
                return resolve();
            }
            let file = fs.createWriteStream(dest);
            https.get(url, function(response) {
                response.pipe(file);
                file.on('finish', function() {
                    file.close(() => {
                        DownloadConversionProgress.downloads++;
                        resolve();
                    });
                });
            }).on('error', function(err) {
                fs.unlink(dest);
                reject();
            });
        })
    },
    downloadSVG(url) {
        DownloadConversionProgress.totalDownloads += 1;
        return new Promise((resolve, reject) => {
            let regex = /[^\/]+\.svg/;
            let dest = Dir.getSVGDir() + '/' + regex.exec(url)[0];
            if (fs.existsSync( dest )) {
                DownloadConversionProgress.downloads++;
                return resolve();
            }
            let file = fs.createWriteStream(dest);
            https.get(url, function(response) {
                response.pipe(file);
                file.on('finish', function() {
                    file.close(() => {
                        DownloadConversionProgress.downloads++;
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