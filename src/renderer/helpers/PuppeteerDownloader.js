import _ from 'lodash'
import puppeteer from 'puppeteer'
import Dir from '@/helpers/Dir'
import fs from 'fs'
const isDev = process.env.NODE_ENV;
import DownloadConversionProgress from '@/store/DownloadConversionProgress'

export default {
    getDownloadObjects(labels) {
        return _.flatMap(labels, (label) => {
            let arr = [
                {
                    type: 'front',
                    designedBottle: label.proposal.orderBottle.designedBottle.id,
                    svgUrl: label.frontLabelSVG,
                    is_hdpi: label.is_hdpi,
                    url: label.frontLabelImage
                },
                {
                    type: 'back',
                    designedBottle: label.proposal.orderBottle.designedBottle.id,
                    svgUrl: label.backLabelSVG,
                    is_hdpi: label.is_hdpi,
                    url: label.backLabelImage
                },
            ];
            if (label.neckLabelSVG) {
                arr.push({
                    type: 'neck',
                    designedBottle: label.proposal.orderBottle.designedBottle.id,
                    svgUrl: label.neckLabelSVG,
                    is_hdpi: label.is_hdpi,
                    url: label.neckLabelImage
                });
            }
            return arr;
        });
    },
    async downloadSVGs(labels, store) {

        let downloadObjects = this.getDownloadObjects(labels);

        const browser = await puppeteer.launch({
            // headless: false,
            // slowMo: 2500 // slow down by 250ms
        });
        const page = await browser.newPage();

        for (let downloadObject of downloadObjects) {

            if (DownloadConversionProgress.cancelled) {
                console.warn('download cancelled');
                throw new Error('Download cancelled');
            }

            let myosURL = '';
            let dest = '';
            // Older designed bottles don't have an SVG
            if (downloadObject.svgUrl && downloadObject.svgUrl !== '') {
                DownloadConversionProgress.downloads++;
                let regex = /[^\/]+\.svg/;
                dest = Dir.getImagesDir() + '/' + regex.exec(downloadObject.svgUrl)[0];
                dest = dest.replace('svg', 'png');
                if (fs.existsSync(dest)) {
                    continue;
                }
                myosURL = 'https://www.makeyourownspirit.com/capture?svg=' + downloadObject.svgUrl + '&type=' + downloadObject.type + '&designed-bottle=' + downloadObject.designedBottle;
                console.log(myosURL);
            } else {
                DownloadConversionProgress.downloads++;
                let regex = /[^\/]+\.png/;
                dest = Dir.getImagesDir() + '/' + regex.exec(downloadObject.url)[0];
                if (fs.existsSync(dest)) {
                    continue;
                }
                myosURL = 'https://www.makeyourownspirit.com/capture?type=' + downloadObject.type + '&designed-bottle=' + downloadObject.designedBottle;
                console.log(myosURL);
            }
            console.log(myosURL);

            await page.goto(myosURL);
            await page.waitFor('.loaded');

            if (!downloadObject.is_hdpi) {
                const dimensions = await page.evaluate(() => {
                    return {
                        width: window.svgSize.width,
                        height: window.svgSize.height,
                        deviceScaleFactor: 2
                    };
                });
                await page.setViewport(dimensions);
            } else {
                const dimensions = await page.evaluate(() => {
                    return {
                        width: window.svgSize.width,
                        height: window.svgSize.height,
                        deviceScaleFactor: 1
                    };
                });
                await page.setViewport(dimensions);
            }

            await page.screenshot({
                path: dest,
                type: 'png',
                // quality: 100
            });

        }

        browser.close();
    }
}