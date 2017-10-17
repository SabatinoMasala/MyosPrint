import Vue from 'vue'
import _ from 'lodash'
import Dir from '@/helpers/Dir'

export default {

    getFichesFromLabels(printer, labels) {

        // Labels are ordered by bottle class
        labels = _.orderBy(labels, function(item) {
            return [item.bottle_class, item.proposal.orderBottle.designedBottle.bottle.slug]
        });

        // labels.forEach((label) => {
        //     console.log(label.bottle_class, label.proposal.orderBottle.designedBottle.bottle.slug)
        // });

        let groupedLabels = _.groupBy(labels, 'size');

        let fichesAmount = [];

        if (printer === 'roll' && Object.keys(groupedLabels).length > 0) {
            groupedLabels['neck'] = [];
            Object.keys(groupedLabels).forEach((size) => {

                if (size === 'neck') { return; }

                groupedLabels[size].forEach((label) => {
                    let neckLabel = Vue.util.extend({}, label);
                    neckLabel.is_neck = true;
                    neckLabel.empty = false;
                    if (neckLabel.neckLabelSVG === '' || neckLabel.neckLabelImage === '') {
                        neckLabel.empty = true;
                    }
                    groupedLabels['neck'].push(neckLabel);
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
                pages[currentPageIndex].front.push({
                    image: Dir.getImagesDir() + '/' + front
                });
                pages[currentPageIndex].back.push({
                    image: Dir.getImagesDir() + '/' + back
                });

                if (neckLabelFile && neckLabelFile !== '') {
                    let neck = regex.exec(neckLabelFile)[0].replace('.svg', '.png');
                    pages[currentPageIndex].neck.push({
                        image: Dir.getImagesDir() + '/' + neck
                    });
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

        if (labels && labels.length > 0 && labels[0].is_neck !== undefined && labels[0].is_neck === true) {

            let pages = [{
                neck: []
            }];
            let currentPageIndex = 0;
            let bottle = 1;
            let combinations = {};

            labels.forEach((label) => {
                for (let i = 0; i < label.amount; i++) {
                    let regex = /[^\/]+\.(svg|png)/;

                    let neck;
                    if (!label.empty) {
                        let neckLabelFile = (label.neckLabelSVG && label.neckLabelSVG !== '') ? label.neckLabelSVG : label.neckLabelImage;

                        let matches = regex.exec(neckLabelFile);
                        neck = matches[0].replace('.svg', '.png');
                    }
                    let combo = label.size + label.bottle_class;
                    if (combinations[combo] === undefined) {
                        combinations[combo] = {
                            count: 1
                        }
                    }
                    let drinkSlug = label.proposal.orderBottle.designedBottle.drink.slug.substring(0, 5);
                    let bottleSlug = label.proposal.orderBottle.designedBottle.bottle.slug.substring(0, 5);
                    if (label.proposal.orderBottle.designedBottle.bottle.slug === 'apotheque') {
                        bottleSlug = 'apoth';
                    }
                    if (label.proposal.orderBottle.designedBottle.bottle.slug === 'apotheque-brun') {
                        bottleSlug = 'apo brun';
                    }
                    pages[currentPageIndex].neck.push({
                        text: [
                            label.proposal.order.hashId,
                            drinkSlug + '-' + bottleSlug,
                            bottle + combo + combinations[combo].count,
                        ],
                        image: !label.empty ? Dir.getImagesDir() + '/' + neck : false
                    });

                    combinations[combo].count++;

                    if (pages[currentPageIndex].neck.length >= 12) {
                        pages.push({
                            neck: []
                        });
                        currentPageIndex++;
                    }

                    bottle++;

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
                    pages[currentPageIndex].front.push({
                        image: Dir.getImagesDir() + '/' + front
                    });
                    pages[currentPageIndex].back.push({
                        image: Dir.getImagesDir() + '/' + back
                    });

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