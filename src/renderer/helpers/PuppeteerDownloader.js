import puppeteer from 'puppeteer'
import Dir from '@/helpers/Dir'
import fs from 'fs'
const isDev = process.env.NODE_ENV;
import DownloadConversionProgress from '@/store/DownloadConversionProgress'

export default {
    async downloadSVGs(urls, store) {

        const browser = await puppeteer.launch({
            // headless: false,
            // slowMo: 2500 // slow down by 250ms
        });
        const page = await browser.newPage();

        for (let url of urls) {

            DownloadConversionProgress.downloads++;

            if (url && url !== '') {
                let regex = /[^\/]+\.svg/;
                let dest = Dir.getImagesDir() + '/' + regex.exec(url)[0];
                dest = dest.replace('svg', 'png');

                if (fs.existsSync( dest )) {
                    continue;
                }

                await page.goto('https://www.makeyourownspirit.com/capture?svg=' + url);
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