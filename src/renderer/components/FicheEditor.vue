<template>
    <div>
        <el-menu mode="horizontal">
            <el-menu-item index="1" @click="$router.back()">
                <i class="el-icon-caret-left"></i>
                Back
            </el-menu-item>
        </el-menu>

        <el-row class="padded toolbar">
            <el-col :span="5">
                <el-select v-model="currentPrinter">
                    <el-option
                            :key="key"
                            :value="printer.value"
                            :label="printer.label"
                            v-for="printer,key in availablePrinters"
                    ></el-option>
                </el-select>
            </el-col>
            <el-col :span="4">
                <el-select v-model="currentFiche">
                    <el-option
                            :key="key"
                            :value="fiche"
                            :label="fiche"
                            v-for="fiche,key in availableFiches"
                    ></el-option>
                </el-select>
            </el-col>
            <el-col class="text-right" :span="12">
                <el-button type="danger" @click.stop.prevent="reset">Reset fiche</el-button>
                <el-button @click.stop.prevent="downloadPDF">Download Sample PDF</el-button>
                <el-button type="primary" @click.stop.prevent="update">Update fiche</el-button>
            </el-col>
        </el-row>

        <el-row class="padded" v-if="fiche">
            <div class="fixed">
                <FicheEditorPage
                        :current-printer="currentPrinter"
                        ref="page"
                        :fiche="fiche"
                ></FicheEditorPage>
            </div>
            <el-col :span="12">&nbsp;</el-col>
            <el-col :span="12">
                <FicheEditorValues
                        :current-printer="currentPrinter"
                        @update="update"
                        :fiche="fiche"
                ></FicheEditorValues>
            </el-col>
        </el-row>

    </div>
</template>
<style lang="scss" scoped>
    .fixed {
        width: 50%;
        height: 100%;
        position: fixed;
        top: 175px;
        left: 10px;
        z-index: 0;
    }
    .padded {
        padding: 15px;
    }
    .toolbar {
        border-bottom: solid 1px #e6e6e6;
    }
</style>
<script>
    import fs from 'fs'
    import PDFMaker from '@/helpers/PDFMaker'
    import CanEditFiche from '@/mixins/CanEditFiche'
    import FicheEditorPage from '@/components/FicheEditorPage'
    import FicheEditorValues from '@/components/FicheEditorValues'
    import Dir from '@/helpers/Dir'
    import Fiche from '@/printers/roll/b.json'
    import FicheResolver from '@/helpers/FicheResolver'
    export default {
        mixins: [CanEditFiche],
        components: {
            FicheEditorPage,
            FicheEditorValues
        },
        mounted() {
            this.updateFiche();
        },
        watch: {
            currentFiche() {
                this.updateFiche();
                this.$refs.page.zoom = 1;
            },
            currentPrinter() {
                this.updateFiche();
                this.$refs.page.zoom = 1;
            }
        },
        methods: {
            reset() {
                let path = false;
                if (this.currentPrinter === 'roll') {
                    path = Dir.getFichesRollDir() + '/' + this.currentFiche + '.json';
                } else if (this.currentPrinter === 'blackmark') {
                    path = Dir.getFichesBlackmarkDir() + '/' + this.currentFiche + '.json';
                }
                if (fs.existsSync(path)) {
                    fs.unlinkSync(path);
                }
                this.updateFiche();
                this.$notify({
                    title: 'Complete!',
                    message: 'Template has been reset to internal values',
                    type: 'info',
                })
            },
            updateFiche() {
                this.fiche = FicheResolver.getFiche(this.currentPrinter, this.currentFiche);
            },
            update() {
                let path = false;
                if (this.currentPrinter === 'roll') {
                    path = Dir.getFichesRollDir() + '/' + this.currentFiche + '.json';
                } else if (this.currentPrinter === 'blackmark') {
                    path = Dir.getFichesBlackmarkDir() + '/' + this.currentFiche + '.json';
                }
                fs.writeFile(path, JSON.stringify(this.fiche, null, 2), 'utf8', (err) => {
                    if (err) {
                        this.$notify({
                            title: 'Error',
                            message: 'Something went wrong while saving the template.',
                            type: 'error',
                        });
                        return;
                    }
                    this.$notify({
                        title: 'Saved!',
                        message: 'Template updated',
                        type: 'info',
                    })
                });
            },
            downloadPDF() {
                PDFMaker.makeSamplePDF(this.fiche);
            }
        },
        data() {
            return {
                currentPrinter: 'roll',
                availablePrinters: [
                    {
                        value: 'roll',
                        label: 'Non-blackmark'
                    },
                    {
                        value: 'blackmark',
                        label: 'Blackmark'
                    }
                ],
                currentFiche: 'b',
                fiche: false,
                availableFiches: [
                    'b',
                    'c',
                    'neck',
                    'mini_a',
                    'mini_b'
                ]
            }
        }
    }
</script>