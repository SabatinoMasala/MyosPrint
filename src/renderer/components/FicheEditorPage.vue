<template>
    <div>
        <div class="text-center" style="margin-bottom: 10px;">
            <p>Zoom:</p>
            <el-input-number :step="0.1" v-model="zoom"></el-input-number>
        </div>
        <div class="page" :style="pageStyle">
            <div class="blackmark" :style="getStyleBlackmark(blackmark)" v-if="currentPrinter === 'blackmark'" v-for="blackmark in blackmarks"></div>
            <div class="slot front" v-for="front,index in slotsFront" :style="getStyleFront(front)" v-if="isAvailableType('front')" :class="{active: front.active}">
                <div class="inner">Front {{ index + 1 }}</div>
            </div>
            <div class="slot back" v-for="back,index in slotsBack" :style="getStyleBack(back)" v-if="isAvailableType('back')" :class="{active: back.active}">
                <div class="inner">Back {{ index + 1 }}</div>
            </div>
            <template v-for="neck,index in slotsNeck" v-if="isAvailableType('neck')">
                <div class="slot neck" :style="getStyleNeck(neck)" :class="{active: neck.active}">
                    <div class="inner">Neck {{ index + 1 }}</div>
                    <div class="info" :style="getStyleInfo(neck)"></div>
                </div>
            </template>
        </div>
    </div>
</template>
<style lang="scss" scoped>
    .page {
        overflow: hidden;
        margin: 0 auto;
        border: 1px #008cff solid;
        position: relative;
        .blackmark {
            position: absolute;
            background-color: #000;
        }
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
            currentPrinter: String,
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
            getStyleInfo(slot) {
                if (!this.hasInfo) {
                    return null;
                }
                const retval = {
                    position: 'absolute',
                    border: '1px #000 solid',
                    width: (this.dimensionsNeck.height * this.multiplier) + 'px',
                    height: (this.dimensionsNeck.height * this.multiplier) + 'px'
                };
                if (slot.info_position === 'bottom') {
                    retval.right = `-${slot.info_margin}px`;
                    retval.transform = 'translate(100%, 0)';
                } else {
                    retval.left = `-${slot.info_margin}px`;
                    retval.transform = 'translate(-100%, 0)';
                }
                return retval;
            },
            getStyleBlackmark(blackmark) {
                return {
                    width: `${blackmark.width * this.multiplier}px`,
                    height: `${blackmark.height * this.multiplier}px`,
                    left: `${blackmark.x * this.multiplier}px`,
                    top: `${blackmark.y * this.multiplier}px`
                }
            },
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
                zoom: 1
            }
        }
    }
</script>