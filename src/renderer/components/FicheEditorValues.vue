<template>
    <div>
        <h1>Dimensions</h1>
        <div>

            <h2>Canvas dimensions</h2>
            <el-input-number v-model="canvasDimensions[0]"></el-input-number>
            <el-input-number v-model="canvasDimensions[1]"></el-input-number>

            <FicheEditorDimensions
                    name="front"
                    :dimensions="dimensionsFront"
                    v-if="isAvailableType('front')"
            ></FicheEditorDimensions>

            <FicheEditorDimensions
                    name="back"
                    :dimensions="dimensionsBack"
                    v-if="isAvailableType('back')"
            ></FicheEditorDimensions>

            <FicheEditorDimensions
                    name="neck"
                    :dimensions="dimensionsNeck"
                    v-if="isAvailableType('neck')"
            ></FicheEditorDimensions>

        </div>

        <div v-if="isAvailableType('front')">
            <h1>Slots front</h1>
            <FicheEditorSlot
                    name="front"
                    :index="index"
                    :fiche="fiche"
                    :key="index"
                    :current-slot="slot"
                    v-for="slot, index in slotsFront"
            ></FicheEditorSlot>
        </div>

        <div v-if="isAvailableType('back')">
            <h1>Slots back</h1>
            <FicheEditorSlot
                    name="back"
                    :fiche="fiche"
                    :index="index"
                    :key="index"
                    :current-slot="slot"
                    v-for="slot, index in slotsBack"
            ></FicheEditorSlot>
        </div>

        <div v-if="isAvailableType('neck')">
            <h1>Slots neck</h1>
            <FicheEditorSlot
                    :index="index"
                    :fiche="fiche"
                    name="neck"
                    :key="index"
                    :current-slot="slot"
                    v-for="slot, index in slotsNeck"
            ></FicheEditorSlot>
        </div>

    </div>
</template>
<script>
    import CanEditFiche from '@/mixins/CanEditFiche'
    import FicheEditorDimensions from '@/components/FicheEditorDimensions'
    import FicheEditorSlot from '@/components/FicheEditorSlot'
    import PDFMaker from '@/helpers/PDFMaker'
    export default {
        mixins: [CanEditFiche],
        props: {
            fiche: Object
        },
        components: {
            FicheEditorDimensions,
            FicheEditorSlot
        }
    }
</script>