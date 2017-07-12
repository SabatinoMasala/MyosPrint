import _ from 'lodash'

export default {

    getFichesFromLabels(labels) {
        let groupedLabels = _.groupBy(labels, 'size');

        let fichesAmount = [];

        Object.keys(groupedLabels).map((size) => {
            let currentLabels = groupedLabels[size];
            let filledSlots = 0;
            let availableSlots = 5;
            currentLabels.forEach((label) => {
                filledSlots += label.amount;
            });
            fichesAmount.push({
                size: size,
                pages: Math.ceil(filledSlots / availableSlots)
            })
        });

        return fichesAmount;
    }

}