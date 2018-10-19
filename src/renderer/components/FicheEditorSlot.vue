<template>
    <div>
        <el-row>
            <h2>Slot {{ name }} #{{ index + 1 }}</h2>
            <el-col :span="24">
                <el-button @click="centerVertical" size="small">Center Vertical</el-button>
                <el-button @click="centerHorizontal" size="small">Center Horizontal</el-button>
                <el-button size="small" type="danger" @click.stop.prevent="$emit('delete')" v-if="canDelete">Delete slot</el-button>
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
        <el-row v-if="hasInfo" class="mt-1">
            <el-col :span="8">
                <p>Info position</p>
                <el-select v-model="currentSlot.info_position">
                    <el-option label="Top" value="top" />
                    <el-option label="Bottom" value="bottom" />
                </el-select>
            </el-col>
            <el-col :span="10">
                <p>Margin</p>
                <el-input-number v-model="currentSlot.info_margin"></el-input-number>
            </el-col>
        </el-row>
    </div>
</template>
<script>
    import CanEditFiche from '@/mixins/CanEditFiche'
    export default {
        mixins: [CanEditFiche],
        props: {
            fiche: Object,
            name: String,
            currentSlot: Object,
            canDelete: {
                type: Boolean,
                default: false
            },
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