<template>
    <el-row>
        <h2>Blackmark position</h2>
        <el-col :span="24">
            <el-button @click="centerVertical" size="small">Center Vertical</el-button>
            <el-button @click="centerHorizontal" size="small">Center Horizontal</el-button>
        </el-col>
        <el-col :span="12">
            <p>
                X value
            </p>
            <el-input-number v-model="blackmark.x"></el-input-number>
        </el-col>
        <el-col :span="12">
            <p>Y value</p>
            <el-input-number v-model="blackmark.y"></el-input-number>
        </el-col>
    </el-row>
</template>
<script>
    import CanEditFiche from '@/mixins/CanEditFiche'
    export default {
        mixins: [CanEditFiche],
        props: {
            fiche: Object
        },
        methods: {
            centerHorizontal() {
                const dimensions = {
                    width: this.blackmark.width,
                    height: this.blackmark.height
                };
                const size = this.fiche.size;
                this.blackmark.x = (size[0] / 2) - (dimensions.width / 2);
            },
            centerVertical() {
                const dimensions = {
                    width: this.blackmark.width,
                    height: this.blackmark.height
                };
                const size = this.fiche.size;
                this.blackmark.y = (size[1] / 2) - (dimensions.height / 2);
            }
        }
    }
</script>