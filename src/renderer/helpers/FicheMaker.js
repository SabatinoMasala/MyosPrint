import Vue from 'vue'
import _ from 'lodash'
import Dir from '@/helpers/Dir'
import FicheResolver from '@/helpers/FicheResolver'

export default {

    getFichesFromLabels(printer, sorting, labels, reversed = false) {

        const fiches = {
            neck: FicheResolver.getFiche(printer, 'neck')
        };

        if (sorting === 'labelling') {
            labels = _.orderBy(labels, function(item) {
                return [
                    item.size,
                    item.bottle_class,
                    item.proposal.orderBottle.designedBottle.bottle.internal_short_name,
                    item.proposal.orderBottle.designedBottle.drink.slug,
                    item.proposal.order.order.timestamp
                ];
            });
            console.log(`Sorting: ${sorting}`);
            labels.map(item => {
                console.log([
                    item.size,
                    item.bottle_class,
                    item.proposal.orderBottle.designedBottle.bottle.internal_short_name,
                    item.proposal.orderBottle.designedBottle.drink.slug,
                    item.proposal.order.order.timestamp
                ]);
            });
        }
        if (sorting === 'bottling') {
            labels = _.orderBy(labels, function(item) {
                return [
                    item.size,
                    item.proposal.orderBottle.designedBottle.drink.slug,
                    item.bottle_class,
                    item.proposal.orderBottle.designedBottle.bottle.internal_short_name,
                    item.proposal.order.order.timestamp
                ];
            });
            console.log(`Sorting: ${sorting}`);
            labels.map(item => {
                console.log([
                    item.size,
                    item.proposal.orderBottle.designedBottle.drink.slug,
                    item.bottle_class,
                    item.proposal.orderBottle.designedBottle.bottle.internal_short_name,
                    item.proposal.order.order.timestamp
                ]);
            });
        }

        if (reversed) {
            labels = labels.reverse();
        }

        // labels.forEach((label) => {
        //     console.log(label.bottle_class, label.proposal.orderBottle.designedBottle.bottle.internal_short_name)
        // });

        let groupedLabels = _.groupBy(labels, 'size');

        let fichesAmount = [];

        if ((printer === 'roll' || printer === 'blackmark') && Object.keys(groupedLabels).length > 0) {
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
            let pages = this.makePages(printer, currentLabels, fiches);

            fichesAmount.push({
                size,
                pages_count: pages.length,
                pages
            })
        });

        return fichesAmount;
    },
    makePages(printer, labels, fiches) {

        switch (printer) {
            case 'classic':
                return this.makeClassicPages(labels, fiches);
                break;
            case 'roll':
                return this.makeRollPages(labels, fiches);
                break;
            case 'blackmark':
                return this.makeRollPages(labels, fiches);
                break;
        }
    },
    makeClassicPages(labels, fiches) {

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
    makeRollPages(labels, fiches) {

        const neckFiche = fiches.neck;

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
                    let combo = label.size;
                    if (combinations[combo] === undefined) {
                        combinations[combo] = {
                            count: 1
                        }
                    }
                    let drinkSlug = label.proposal.orderBottle.designedBottle.drink.slug.substring(0, 5);
                    let bottleSlug = label.proposal.orderBottle.designedBottle.bottle.internal_short_name;
                    pages[currentPageIndex].neck.push({
                        text: [
                            label.proposal.order.hashId,
                            drinkSlug + '-' + bottleSlug,
                            combo + combinations[combo].count,
                        ],
                        image: !label.empty ? Dir.getImagesDir() + '/' + neck : false
                    });

                    combinations[combo].count++;

                    if (pages[currentPageIndex].neck.length >= neckFiche.slots.neck.length) {
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
            let needsNewPage = false;

            labels.forEach((label) => {
                for (let i = 0; i < label.amount; i++) {

                    if (needsNewPage) {
                        pages.push({
                            front: [],
                            back: [],
                        });
                        needsNewPage = false;
                    }

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
                        needsNewPage = true;
                        currentPageIndex++;
                    }

                }
            });

            return pages;
        }

    }

}