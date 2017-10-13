import {mapGetters, mapState} from 'vuex'
export default {
    computed: {
        ...mapState({
            fiche: state => state.FicheEditor.fiche
        }),
        ...mapGetters({
            canvasDimensions: 'FicheEditor/canvasDimensions',
            slotsFront: 'FicheEditor/slotsFront',
            slotsBack: 'FicheEditor/slotsBack',
            dimensionsFront: 'FicheEditor/dimensionsFront',
            dimensionsBack: 'FicheEditor/dimensionsBack'
        })
    }
}