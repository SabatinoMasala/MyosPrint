import _ from 'lodash'
import Dir from '@/helpers/Dir'

export default {

    getFichesFromLabels(printer, labels) {
        let groupedLabels = _.groupBy(labels, 'size');

        let fichesAmount = [];

        if (printer === 'roll' && Object.keys(groupedLabels).length > 0) {
            groupedLabels['neck'] = [];
            Object.keys(groupedLabels).forEach((size) => {

                if (size === 'neck') { return; }

                groupedLabels[size].forEach((label) => {
                    groupedLabels['neck'].push({
                        neckLabelSVG: label.neckLabelSVG,
                        neckLabelImage: label.neckLabelImage,
                        is_neck: true,
                        amount: label.amount,
                        size: label.size,
                    });
                });
            });
        }

        Object.keys(groupedLabels).map((size) => {
            let currentLabels = groupedLabels[size];
            let pages = this.makePages(printer, currentLabels);

            fichesAmount.push({
                size: size,
                pages_count: pages.length,
                pages: pages
            })
        });

        return fichesAmount;
    },
    makePages(printer, labels) {

        switch (printer) {
            case 'classic':
                return this.makeClassicPages(labels);
                break;
            case 'roll':
                return this.makeRollPages(labels);
                break;
        }
    },
    makeClassicPages(labels) {

        let pages = [{
            front: [],
            back: [],
            neck: [],
        }];
        let currentPageIndex = 0;

        labels.forEach((label) => {
            for (let i = 0; i < label.amount; i++) {
                let regex = /[^\/]+\.(svg|png)/;

                let frontLabelFile = (label.frontLabelSVG && label.frontLabelSVG !== '') ? label.frontLabelSVG : label.frontLabelImage;
                let backLabelFile = (label.backLabelSVG && label.backLabelSVG !== '') ? label.backLabelSVG : label.backLabelImage;
                let neckLabelFile = (label.neckLabelSVG && label.neckLabelSVG !== '') ? label.neckLabelSVG : label.neckLabelImage;

                let front = regex.exec(frontLabelFile)[0].replace('.svg', '.png');
                let back = regex.exec(backLabelFile)[0].replace('.svg', '.png');
                pages[currentPageIndex].front.push( Dir.getImagesDir() + '/' + front );
                pages[currentPageIndex].back.push( Dir.getImagesDir() + '/' + back );

                if (neckLabelFile && neckLabelFile !== '') {
                    let neck = regex.exec(neckLabelFile)[0].replace('.svg', '.png');
                    pages[currentPageIndex].neck.push( Dir.getImagesDir() + '/' + neck );
                }

                if (pages[currentPageIndex].neck.length >= 5 || pages[currentPageIndex].back.length >= 5 ||  pages[currentPageIndex].front.length >= 5) {
                    pages.push({
                        front: [],
                        back: [],
                        neck: [],
                    });
                    currentPageIndex++;
                }

            }
        });

        return pages;
    },
    makeRollPages(labels) {

        if (labels && labels[0].is_neck !== undefined && labels[0].is_neck === true) {

            let pages = [{
                neck: []
            }];
            let currentPageIndex = 0;

            labels.forEach((label) => {
                for (let i = 0; i < label.amount; i++) {
                    let regex = /[^\/]+\.(svg|png)/;

                    let neckLabelFile = (label.neckLabelSVG && label.neckLabelSVG !== '') ? label.neckLabelSVG : label.neckLabelImage;

                    let neck = regex.exec(neckLabelFile)[0].replace('.svg', '.png');
                    pages[currentPageIndex].neck.push( Dir.getImagesDir() + '/' + neck );

                    if (pages[currentPageIndex].neck.length >= 12) {
                        pages.push({
                            neck: []
                        });
                        currentPageIndex++;
                    }

                }
            });

            return pages;
        } else {
            let pages = [{
                front: [],
                back: [],
            }];
            let currentPageIndex = 0;

            labels.forEach((label) => {
                for (let i = 0; i < label.amount; i++) {
                    let regex = /[^\/]+\.(svg|png)/;

                    let frontLabelFile = (label.frontLabelSVG && label.frontLabelSVG !== '') ? label.frontLabelSVG : label.frontLabelImage;
                    let backLabelFile = (label.backLabelSVG && label.backLabelSVG !== '') ? label.backLabelSVG : label.backLabelImage;

                    let front = regex.exec(frontLabelFile)[0].replace('.svg', '.png');
                    let back = regex.exec(backLabelFile)[0].replace('.svg', '.png');
                    pages[currentPageIndex].front.push( Dir.getImagesDir() + '/' + front );
                    pages[currentPageIndex].back.push( Dir.getImagesDir() + '/' + back );

                    if (pages[currentPageIndex].back.length >= 1 ||  pages[currentPageIndex].front.length >= 1) {
                        pages.push({
                            front: [],
                            back: [],
                        });
                        currentPageIndex++;
                    }

                }
            });

            return pages;
        }

    }

}