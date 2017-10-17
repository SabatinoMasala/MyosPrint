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
                    url: label.frontLabelSVG
                },
                {
                    type: 'back',
                    designedBottle: label.proposal.orderBottle.designedBottle.id,
                    url: label.backLabelSVG
                },
            ];
            if (label.neckLabelSVG) {
                arr.push({
                    type: 'neck',
                    designedBottle: label.proposal.orderBottle.designedBottle.id,
                    url: label.neckLabelSVG
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

            let url = downloadObject.url;

            DownloadConversionProgress.downloads++;

            if (url && url !== '') {
                let regex = /[^\/]+\.svg/;
                let dest = Dir.getImagesDir() + '/' + regex.exec(url)[0];
                dest = dest.replace('svg', 'png');

                if (fs.existsSync( dest )) {
                    continue;
                }

                let myosURL = 'https://www.makeyourownspirit.com/capture?svg=' + url + '&type=' + downloadObject.type + '&designed-bottle=' + downloadObject.designedBottle;
                await page.goto(myosURL);
                await page.waitFor('.loaded');

                const dimensions = await page.evaluate(() => {
                    return {
                        width: window.svgSize.width,
                        height: window.svgSize.height,
                        deviceScaleFactor: 2
                    };
                });
                await page.setViewport(dimensions);

                await page.screenshot({
                    path: dest,
                    type: 'png',
                    // quality: 100
                });
            }

        }

        browser.close();
    }
}