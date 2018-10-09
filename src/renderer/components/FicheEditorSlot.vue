<template>
    <el-row>
        <h2>Slot {{ name }} #{{ index + 1 }}</h2>
        <el-col :span="24">
            <el-button @click="centerVertical" size="small">Center Vertical</el-button>
            <el-button @click="centerHorizontal" size="small">Center Horizontal</el-button>
        </el-col>
        <el-col :span="8">
            <p>
                X value
            </p>
            <el-input-number v-model="currentSlot.x"></el-input-number>
        </el-col>
        <el-col :span="8">
            <p>Y value</p>
            <el-input-number v-model="currentSlot.y"></el-input-number>
        </el-col>
        <el-col :span="8">
            <p>Rotation</p>
            <el-select v-model="currentSlot.rotation">
                <el-option
                        label="0deg"
                        :value="0"
                ></el-option>
                <el-option
                        label="90deg"
                        :value="90"
                ></el-option>
            </el-select>
        </el-col>
    </el-row>
</template>
<script>
    import CanEditFiche from '@/mixins/CanEditFiche'
    export default {
        mixins: [CanEditFiche],
        props: {
            fiche: Object,
            name: String,
            currentSlot: Object,
            index: Number
        },
        methods: {
            centerHorizontal() {
                const dimensions = this.fiche.dimensions[this.name];
                const size = this.fiche.size;
                if (this.currentSlot.rotation === 90) {
                    this.currentSlot.x = (size[0] / 2) - (dimensions.height / 2);
                } else {
                    this.currentSlot.x = (size[0] / 2) - (dimensions.width / 2);
                }
            },
            centerVertical() {
                const dimensions = this.fiche.dimensions[this.name];
                const size = this.fiche.size;
                if (this.currentSlot.rotation === 90) {
                    this.currentSlot.y = (size[1] / 2) - (dimensions.width / 2);
                } else {
                    this.currentSlot.y = (size[1] / 2) - (dimensions.height / 2);
                }
            }
        }
    }
</script>