<template>
    <div>
        <h1>Dimensions</h1>
        <div>
            <h2>Canvas dimensions</h2>
            <el-input-number v-model="canvasDimensions[0]"></el-input-number>
            <el-input-number v-model="canvasDimensions[1]"></el-input-number>

            <h2>Dimensions front</h2>
            <el-input-number v-model="dimensionsFront.width"></el-input-number>
            <el-input-number v-model="dimensionsFront.height"></el-input-number>

            <h2>Dimensions back</h2>
            <el-input-number v-model="dimensionsBack.width"></el-input-number>
            <el-input-number v-model="dimensionsBack.height"></el-input-number>
        </div>
        <h1>Slots front</h1>
        <div v-for="slot, index in slotsFront">
            <h2>Slot front #{{ index + 1 }}</h2>
            <el-input-number v-model="slot.x"></el-input-number>
            <el-input-number v-model="slot.y"></el-input-number>
            <el-select v-model="slot.rotation">
                <el-option
                        label="0deg"
                        :value="0"
                ></el-option>
                <el-option
                        label="90deg"
                        :value="90"
                ></el-option>
            </el-select>
        </div>
        <h1>Slots back</h1>
        <div v-for="slot, index in slotsBack">
            <h2>Slot back #{{ index + 1 }}</h2>
            <el-input-number v-model="slot.x"></el-input-number>
            <el-input-number v-model="slot.y"></el-input-number>
            <el-select v-model="slot.rotation">
                <el-option
                        label="0deg"
                        :value="0"
                ></el-option>
                <el-option
                        label="90deg"
                        :value="90"
                ></el-option>
            </el-select>
        </div>
    </div>
</template>
<script>
    import CanEditFiche from '@/mixins/CanEditFiche'
    import PDFMaker from '@/helpers/PDFMaker'
    export default {
        mixins: [CanEditFiche],
        props: {
            fiche: Object
        }
    }
</script>