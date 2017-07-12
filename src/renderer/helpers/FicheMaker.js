import _ from 'lodash'
import Dir from '@/helpers/Dir'

export default {

    getFichesFromLabels(labels) {
        let groupedLabels = _.groupBy(labels, 'size');

        let fichesAmount = [];

        Object.keys(groupedLabels).map((size) => {
            let currentLabels = groupedLabels[size];
            let pages = this.makePages(currentLabels);

            fichesAmount.push({
                size: size,
                pages_count: pages.length,
                pages: pages
            })
        });

        return fichesAmount;
    },
    makePages(labels) {

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
    }

}