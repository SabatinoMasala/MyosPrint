<template>
    <div>
        <div class="text-center" style="margin-bottom: 10px;">
            <p>Zoom:</p>
            <el-input-number :step="0.1" v-model="zoom"></el-input-number>
        </div>
        <div class="page" :style="pageStyle">
            <div class="slot front" v-for="front,index in slotsFront" :style="getStyleFront(front)" v-if="isAvailableType('front')" :class="{active: front.active}">
                <div class="inner">Front {{ index + 1 }}</div>
            </div>
            <div class="slot back" v-for="back,index in slotsBack" :style="getStyleBack(back)" v-if="isAvailableType('back')" :class="{active: back.active}">
                <div class="inner">Back {{ index + 1 }}</div>
            </div>
            <div class="slot neck" v-for="neck,index in slotsNeck" :style="getStyleNeck(neck)" v-if="isAvailableType('neck')" :class="{active: neck.active}">
                <div class="inner">Neck {{ index + 1 }}</div>
            </div>
        </div>
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
            &.active {
                background-color: rgba(255, 0, 0, 0.1);
            }
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
        props: {
            fiche: Object
        },
        computed: {
            multiplier() {
                return this.zoom;
            },
            pageStyle() {
                return {
                    width: (this.fiche.size[0] * this.multiplier) + 'px',
                    height: (this.fiche.size[1] * this.multiplier) + 'px'
                }
            },
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
            },
            getStyleNeck(slot) {
                if (slot.rotation === 90) {
                    return {
                        width: (this.dimensionsNeck.width * this.multiplier) + 'px',
                        height: (this.dimensionsNeck.height * this.multiplier) + 'px',
                        left: ((slot.x + this.dimensionsNeck.height) * this.multiplier) + 'px',
                        top: (slot.y * this.multiplier) + 'px',
                        transform: 'rotate(90deg)'
                    }
                } else {
                    return {
                        width: (this.dimensionsNeck.width * this.multiplier) + 'px',
                        height: (this.dimensionsNeck.height * this.multiplier) + 'px',
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