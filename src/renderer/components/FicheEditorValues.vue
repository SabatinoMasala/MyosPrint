<template>
    <div>
        <h1>Dimensions</h1>
        <div>

            <h2>Canvas dimensions</h2>
            <el-input-number v-model="canvasDimensions[0]"></el-input-number>
            <el-input-number v-model="canvasDimensions[1]"></el-input-number>

            <div class="spacer"></div>

            <template v-if="currentPrinter === 'blackmark'">
                <div class="mb-1">
                    <el-button size="small" type="primary" @click.stop.prevent="addBlackmark">Add blackmark</el-button>
                </div>
                <template v-for="blackmark, index in blackmarks">
                    <FicheEditorDimensions
                            :name="`blackmark ${index + 1}`"
                            :dimensions="blackmark"
                            :blackmark="blackmark"
                    ></FicheEditorDimensions>

                    <FicheEditorBlackmark
                            :fiche="fiche"
                            @delete="deleteBlackmark(blackmark)"
                            :blackmark="blackmark"
                    ></FicheEditorBlackmark>

                    <div class="spacer"></div>
                </template>
            </template>

            <template
                v-if="isAvailableType('front')"
            >
                <FicheEditorDimensions
                    name="front"
                    :dimensions="dimensionsFront"
                ></FicheEditorDimensions>
                <div class="spacer"></div>
            </template>

            <template
                v-if="isAvailableType('back')"
            >
                <FicheEditorDimensions
                        name="back"
                        :dimensions="dimensionsBack"
                        v-if="isAvailableType('back')"
                ></FicheEditorDimensions>
                <div class="spacer"></div>
            </template>

            <template
                v-if="isAvailableType('neck')"
            >
                <FicheEditorDimensions
                    name="neck"
                    :dimensions="dimensionsNeck"
                ></FicheEditorDimensions>
            </template>

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
            <el-button size="small" type="primary" @click.stop.prevent="addSlot('neck')">Add slot</el-button>
            <FicheEditorSlot
                    :index="index"
                    :fiche="fiche"
                    name="neck"
                    :key="index"
                    :can-delete="true"
                    @delete="deleteSlot('neck', slot)"
                    :current-slot="slot"
                    v-for="slot, index in slotsNeck"
            ></FicheEditorSlot>
        </div>

    </div>
</template>
<style scoped lang="scss">
    .spacer {
        width: 100%;
        height: 2px;
        background-color: #ccc;
        margin: 30px 0;
    }
</style>
<script>
    import CanEditFiche from '@/mixins/CanEditFiche'
    import FicheEditorDimensions from '@/components/FicheEditorDimensions'
    import FicheEditorBlackmark from '@/components/FicheEditorBlackmark'
    import FicheEditorSlot from '@/components/FicheEditorSlot'
    import PDFMaker from '@/helpers/PDFMaker'
    export default {
        mixins: [CanEditFiche],
        props: {
            currentPrinter: String,
            fiche: Object
        },
        methods: {
            deleteSlot(type, slot) {
                const slotsArray = this.fiche.slots[type];
                slotsArray.splice(slotsArray.indexOf(slot), 1);
            },
            addSlot(type) {
                const slotsArray = this.fiche.slots[type];
                const newSlot = Object.assign({}, slotsArray[slotsArray.length - 1]);
                newSlot.x += 20;
                slotsArray.push(newSlot);
            },
            addBlackmark() {
                if (!this.fiche.blackmarks) {
                    this.fiche.blackmarks = [];
                }
                this.fiche.blackmarks.push({
                    x: 0,
                    y: 0,
                    width: 10,
                    height: 10
                });
            },
            deleteBlackmark(blackmark) {
                this.fiche.blackmarks.splice(this.fiche.blackmarks.indexOf(blackmark), 1);
            }
        },
        components: {
            FicheEditorBlackmark,
            FicheEditorDimensions,
            FicheEditorSlot
        }
    }
</script>