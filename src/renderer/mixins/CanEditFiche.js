export default {
    computed: {
        canvasDimensions() {
            return this.fiche.size;
        },
        slotsFront() {
            return this.fiche.slots.front
        },
        slotsBack() {
            return this.fiche.slots.back
        },
        dimensionsFront() {
            return this.fiche.dimensions.front;
        },
        dimensionsBack() {
            return this.fiche.dimensions.back;
        }
    }
}