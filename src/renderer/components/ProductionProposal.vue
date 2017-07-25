<template>
    <div>

        <el-menu theme="dark" class="el-menu-demo" mode="horizontal">
            <el-menu-item index="1" @click="goHome()">
                <i class="el-icon-caret-left"></i>
                Back home
            </el-menu-item>
        </el-menu>

        <PPSettings></PPSettings>

        <div style="margin: 50px;">
            <h1>Production proposal <strong style="border-bottom: 1px #000 dashed;">{{ productionProposalID }}</strong></h1>
            <el-button class="mb-1" @click="openModal('modal-settings')">Settings</el-button>
            <el-table :data="fiches" empty-text="No fiches" v-loading="loading" :element-loading-text="getLoadingText()">
                <el-table-column
                        prop="size"
                        label="Size">
                </el-table-column>
                <el-table-column
                        prop="pages_count"
                        label="Number of pages">
                </el-table-column>
                <el-table-column
                        label="Operations">
                    <template scope="scope">
                        <el-button :disabled="isDisabledButton(scope.$index)" type="primary" size="small" @click="makePDF(scope.$index)">
                            <span v-if="!isDisabledButton(scope.$index)">Get PDF</span>
                            <span v-else>This template is not available</span>
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>

    </div>
</template>
<script>

    import sharp from 'sharp'
    import _ from 'lodash'
    import API from '@/helpers/api'
    import Dir from '@/helpers/Dir'
    import FicheMaker from '@/helpers/FicheMaker'
    import PDFMaker from '@/helpers/PDFMaker'
    import Download from '@/helpers/Download'
    import Promise from 'bluebird'
    import SVGConvert from '@/helpers/SVGConvert'
    import PPSettings from '@/components/PPSettings.vue'
    import DownloadConversionProgress from '@/store/DownloadConversionProgress'

    export default {
        watch: {
            '$route': 'updateRoute',
        },
        components: {
            PPSettings
        },
        computed: {
            fiches() {
                return FicheMaker.getFichesFromLabels(this.$store.state.Settings.printer, this.labels)
            },
            labels() {
                return this.bottleProposals.map((proposal) => {
                    let bottleClass = '#';
                    if (proposal.orderBottle.designedBottle.bottle.class !== null) {
                        bottleClass = proposal.orderBottle.designedBottle.bottle.class.toLowerCase();
                    }
                    return {
                        proposal: proposal,
                        amount:proposal.orderBottle.amount,
                        size: proposal.orderBottle.designedBottle.label.size.toLowerCase(),
                        bottle_class: bottleClass,
                        frontLabelImage: proposal.orderBottle.designedBottle.frontLabel,
                        backLabelImage: proposal.orderBottle.designedBottle.backLabel,
                        neckLabelImage: proposal.orderBottle.designedBottle.neckLabel,
                        frontLabelSVG: proposal.orderBottle.designedBottle.frontLabelSVG,
                        backLabelSVG: proposal.orderBottle.designedBottle.backLabelSVG,
                        neckLabelSVG: proposal.orderBottle.designedBottle.neckLabelSVG,
                    };
                })
            },
            bottleProposals() {
                if (this.productionProposal) {
                    return _.flatMap(this.productionProposal.orders, ((order) => {
                        return order.bottleProposals.map((bottleProposal) => {
                            bottleProposal.order = order;
                            return bottleProposal;
                        });
                    }))
                }
                return []
            }
        },
        mounted() {
            this.load();
        },
        methods: {
            load() {
                this.loading = true;
                this.labels = [];
                this.downloadConversionProgress.reset();
                this.$notify({
                    title: 'Hold on tight',
                    message: 'Production proposal is preparing',
                    type: 'info',
                });
                this.$http.get(API + '/production-proposals/' + this.productionProposalID)
                    .then((response) => {
                        this.productionProposal = response.data['production-proposal'];
                        this.startDownload();
                    })
                    .catch((error) => {
                    })
            },
            updateRoute() {
                this.productionProposalID = this.$route.params.proposal_id;
                this.load();
            },
            openModal(modal) {
                this.$store.commit('OPEN_MODAL', modal)
            },
            getLoadingText() {
                if (this.downloadConversionProgress.currentProcedure === 'DOWNLOAD') {
                    return 'Downloading: ' + this.downloadConversionProgress.downloads + '/' + this.downloadConversionProgress.totalDownloads;
                } else if (this.downloadConversionProgress.currentProcedure === 'CONVERT') {
                    return 'Converting ' + this.downloadConversionProgress.totalConversions + ' files (this can take a while)'
                } else {
                    return 'Loading';
                }
            },
            isDisabledButton(index) {
                if (this.fiches.length > 0) {
                    if (this.fiches[index].size === 'b' || this.fiches[index].size === 'c' || this.fiches[index].size === 'neck') {
                        return false;
                    }
                    return true;
                }
            },
            startDownload() {
                let downloads = [];
                this.downloadConversionProgress.currentProcedure = 'DOWNLOAD';
                this.labels.forEach((label) => {
                    downloads.push(
                        Promise.all(Download.downloadSVGFromLabel(label))
                    );
                });
                Promise.all(downloads).then(() => {
                    this.downloadConversionProgress.currentProcedure = 'CONVERT';
                    console.log('downloading done');
                    return SVGConvert.convertAll(this.labels);
                    //return Promise.all(conversions)
                }).then(() => {
                    this.loading = false;
                    this.downloadConversionProgress.reset();
                }).error((e) => {
                    console.log(e);
                })
            },
            makePDF(index) {
                this.loading = true;
                let filename = this.$store.state.Settings.printer + '_' + this.productionProposalID + '_' + this.fiches[index].size;
                PDFMaker.makePDF( this.$store, this.fiches[index].pages, this.fiches[index].size, filename ).then(() => {
                    this.loading = false;
                })
            },
            goHome() {
                this.$router.push({
                    name: 'home',
                })
            }
        },
        data() {
            return {
                downloadConversionProgress: DownloadConversionProgress,
                loading: false,
                productionProposalID: this.$route.params.proposal_id,
                productionProposal: false,
            }
        }
    }
</script>
