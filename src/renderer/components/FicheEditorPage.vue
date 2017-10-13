<template>
    <div>
        <div class="page" :style="pageStyle">
            <div class="slot front" v-for="front,index in slotsFront" :style="getStyleFront(front)">
                <div class="inner">Front {{ index + 1 }}</div>
            </div>
            <div class="slot back" v-for="back,index in slotsBack" :style="getStyleBack(back)">
                <div class="inner">Back {{ index + 1 }}</div>
            </div>
        </div>

        <div class="text-center" style="margin-top: 10px;">
            <p>Zoom:</p>
            <el-input-number :step="0.1" v-model="zoom"></el-input-number>
        </div>
        <pre>{{ fiche }}</pre>
    </div>
</template>
<style lang="scss" scoped>
    .page {
        margin: 0 auto;
        border: 1px #008cff solid;
        position: relative;
        .slot {
            position: absolute;
            border: 1px #f00 solid;
            transform-origin: top left;
            .inner {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
            }
        }
    }
</style>
<script>
    import CanEditFiche from '@/mixins/CanEditFiche'
    export default {
        mixins: [CanEditFiche],
        computed: {
            multiplier() {
                return this.zoom;
            },
            pageStyle() {
                return {
                    width: (this.fiche.size[0] * this.multiplier) + 'px',
                    height: (this.fiche.size[1] * this.multiplier) + 'px'
                }
            }
        },
        methods: {
            getStyleFront(slot) {
                if (slot.rotation === 90) {
                    return {
                        width: (this.dimensionsFront.width * this.multiplier) + 'px',
                        height: (this.dimensionsFront.height * this.multiplier) + 'px',
                        left: ((slot.x + this.dimensionsFront.height) * this.multiplier) + 'px',
                        top: (slot.y * this.multiplier) + 'px',
                        transform: 'rotate(90deg)'
                    }
                } else {
                    return {
                        width: (this.dimensionsFront.width * this.multiplier) + 'px',
                        height: (this.dimensionsFront.height * this.multiplier) + 'px',
                        left: (slot.x * this.multiplier) + 'px',
                        top: (slot.y * this.multiplier) + 'px'
                    }
                }
            },
            getStyleBack(slot) {
                if (slot.rotation === 90) {
                    return {
                        width: (this.dimensionsBack.width * this.multiplier) + 'px',
                        height: (this.dimensionsBack.height * this.multiplier) + 'px',
                        left: ((slot.x + this.dimensionsBack.height) * this.multiplier) + 'px',
                        top: (slot.y * this.multiplier) + 'px',
                        transform: 'rotate(90deg)'
                    }
                } else {
                    return {
                        width: (this.dimensionsBack.width * this.multiplier) + 'px',
                        height: (this.dimensionsBack.height * this.multiplier) + 'px',
                        left: (slot.x * this.multiplier) + 'px',
                        top: (slot.y * this.multiplier) + 'px'
                    }
                }
            }
        },
        data() {
            return {
                zoom: 2
            }
        }
    }
</script>