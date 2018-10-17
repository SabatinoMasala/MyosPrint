export default {
    computed: {
        availableTypes() {
            return Object.keys(this.fiche.slots)
        },
        canvasDimensions() {
            return this.fiche.size;
        },
        slotsBack() {
            return this.slots('back');
        },
        slotsFront() {
            return this.slots('front');
        },
        slotsNeck() {
            return this.slots('neck');
        },
        dimensionsFront() {
            return this.dimensions('front');
        },
        dimensionsBack() {
            return this.dimensions('back');
        },
        dimensionsNeck() {
            return this.dimensions('neck');
        },
        blackmarks() {
            return this.fiche.blackmarks;
        }
    },
    methods: {
        isAvailableType(type) {
            return this.availableTypes.indexOf(type) !== -1;
        },
        slots(type) {
            return this.fiche.slots[type]
        },
        dimensions(type) {
            return this.fiche.dimensions[type]
        }
    }
}