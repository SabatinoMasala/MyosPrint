<template>
    <div>
        <el-menu mode="horizontal">
            <el-menu-item index="1">
                <i class="el-icon-caret-left"></i>
                Back
            </el-menu-item>
        </el-menu>

        <el-row class="padded toolbar">
            <el-col :span="12">
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
                <el-button @click.stop.prevent="downloadPDF">Download Sample PDF</el-button>
                <el-button type="primary" @click.stop.prevent="$emit('update')">Update fiche</el-button>
            </el-col>
        </el-row>

        <el-row class="padded" v-if="fiche">
            <el-col :span="12">
                <FicheEditorPage :fiche="fiche"></FicheEditorPage>
            </el-col>
            <el-col :span="12">
                <FicheEditorValues
                        @update="update"
                        :fiche="fiche"
                ></FicheEditorValues>
            </el-col>
        </el-row>

    </div>
</template>
<style lang="scss" scoped>
    .padded {
        padding: 15px;
    }
    .toolbar {
        border-bottom: solid 1px #e6e6e6;
    }
</style>
<script>
    import fs from 'fs'
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
            this.updateFiche()
        },
        watch: {
            currentFiche() {
                this.updateFiche();
            }
        },
        methods: {
            updateFiche() {
                this.fiche = FicheResolver.getFiche('roll', this.currentFiche);
            },
            update() {
                let path = Dir.getFichesDir() + '/' + '123' + '.json';
                fs.writeFile(path, JSON.stringify(this.fiche, null, 2), 'utf8', function (err) {
                    if (err) {
                        return console.log(err);
                    }
                    console.log("The file was saved!");
                });
            },
            downloadPDF() {
                PDFMaker.makeSamplePDF(this.fiche);
            }
        },
        data() {
            return {
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