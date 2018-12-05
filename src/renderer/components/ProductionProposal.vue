<template>
    <div>

        <el-menu theme="dark" class="el-menu-demo" mode="horizontal">
            <el-menu-item index="1" @click="goHome()">
                <i class="el-icon-caret-left"></i>
                Back home
            </el-menu-item>
        </el-menu>

        <PPSettings />

        <div style="margin: 50px;">
            <div class="text-center">
                <h1>Production proposal <strong style="border-bottom: 1px #000 dashed;">{{ productionProposalID }}</strong></h1>
                <el-button :disabled="loading" class="mb-1" @click="openModal('modal-settings')">Settings</el-button>
                <el-button :disabled="loading" class="mb-1" @click="$router.push('/fiche-editor')">Edit fiches</el-button>
            </div>
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
                    <template slot-scope="scope">
                        <el-button :disabled="isDisabledButton(scope.$index)" type="primary" size="small" @click="makePDF(scope.$index)">
                            <span v-if="!isDisabledButton(scope.$index)">Render PDF again</span>
                            <span v-else>This template is not available</span>
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>

    </div>
</template>
<script>

    import store from 'store'
    import sharp from 'sharp'
    import _ from 'lodash'
    import API from '@/helpers/api'
    import Dir from '@/helpers/Dir'
    import OpensModals from '@/mixins/OpensModals'
    import FicheMaker from '@/helpers/FicheMaker'
    import PDFMaker from '@/helpers/PDFMaker'
    import Promise from 'bluebird'
    import PPSettings from '@/components/PPSettings.vue'
    import DownloadConversionProgress from '@/store/DownloadConversionProgress'
    import PuppeteerDownloader from "../helpers/PuppeteerDownloader";

    export default {
        mixins: [OpensModals],
        watch: {
            '$route': 'updateRoute',
        },
        components: {
            PPSettings
        },
        computed: {
            b2bOrB2c() {
                if (this.productionProposal) {
                    if (this.productionProposal.is_b2b) {
                        return 'b2b';
                    }
                }
                return 'b2c';
            },
            settings() {
                return this.$store.state.Settings.config[this.printer][this.b2bOrB2c];
            },
            printer() {
                return this.$store.state.Settings.printer;
            },
            fiches() {
                const printer = this.printer;
                const sorting = this.settings.sorting;
                const reversed = this.settings.reversed;
                return FicheMaker.getFichesFromLabels(printer, sorting, this.labels, reversed)
            },
            labels() {
                return this.bottleProposals.map((proposal) => {
                    let bottleClass = '#';
                    if (proposal.orderBottle.designedBottle.bottle.class !== null) {
                        bottleClass = proposal.orderBottle.designedBottle.bottle.class.toLowerCase();
                    }
                    // proposal.orderBottle.designedBottle.drink.slug = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'][Math.floor(Math.random() * 8)] + '-drink';
                    return {
                        proposal: proposal,
                        amount:proposal.orderBottle.amount,
                        size: proposal.orderBottle.designedBottle.label.size.toLowerCase(),
                        bottle_class: bottleClass,
                        is_hdpi: proposal.orderBottle.designedBottle.is_hdpi,
                        frontLabelImage: proposal.orderBottle.designedBottle.frontLabel,
                        backLabelImage: proposal.orderBottle.designedBottle.backLabel,
                        neckLabelImage: proposal.orderBottle.designedBottle.neckLabel,
                        frontLabelSVG: proposal.orderBottle.designedBottle.frontLabelSVG,
                        backLabelSVG: proposal.orderBottle.designedBottle.backLabelSVG,
                        neckLabelSVG: proposal.orderBottle.designedBottle.neckLabelSVG
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
            document.addEventListener('keydown', this.keyHandler);
            this.load();
        },
        beforeDestroy() {
            document.removeEventListener('keydown', this.keyHandler);
        },
        methods: {
            keyHandler(e) {
                if (e.keyCode === 27) {
                    this.cancelActionsIfNeeded();
                }
            },
            cancelActionsIfNeeded() {
                if (this.downloadConversionProgress.currentProcedure === 'PDF') {
                    this.downloadConversionProgress.currentProcedure = 'cancel';
                    this.currentPdfPromise.cancel();
                } else if (this.downloadConversionProgress.currentProcedure === 'DOWNLOAD') {
                    this.downloadConversionProgress.currentProcedure = 'cancel';
                    this.downloadConversionProgress.cancelled = true;
                }
            },
            load() {
                this.loading = true;
                this.downloadConversionProgress.reset();
                this.$notify({
                    title: 'Hold on tight',
                    message: 'Production proposal is preparing',
                    type: 'info',
                });
                this.$http.get(API + '/production-proposals/' + this.productionProposalID)
                    .then((response) => {
                        this.productionProposal = response.data['production-proposal'];
                        return this.captureSVGs();
                    })
                    .then(() => {
                        this.downloadConversionProgress.reset();
                        const shouldAutoDownload = store.get('should_auto_download') !== undefined ? store.get('should_auto_download') : true;
                        debugger;
                        if (shouldAutoDownload) {
                            this.makeNextPdf();
                        } else {
                            this.loading = false;
                        }
                    })
                    .catch((error) => {
                        console.error(error);
                        this.goHome();
                        this.$notify({
                            title: 'Error',
                            message: 'Download has been cancelled, returning back home',
                            type: 'error',
                        });
                    })
            },
            updateRoute() {
                this.productionProposalID = this.$route.params.proposal_id;
                this.load();
            },
            getLoadingText() {
                if (this.downloadConversionProgress.currentProcedure === 'DOWNLOAD') {
                    return 'Downloading & converting: ' + this.downloadConversionProgress.downloads + '/' + this.downloadConversionProgress.totalDownloads;
                } else if (this.downloadConversionProgress.currentProcedure === 'PDF') {
                    if (this.downloadConversionProgress.currentPDF !== false) {
                        return `Making PDF ${this.downloadConversionProgress.currentPDF}`;
                    } else {
                        return 'Making PDFs';
                    }
                } else if (this.downloadConversionProgress.currentProcedure === 'cancel') {
                    return 'Cancelling';
                } else {
                    return 'Loading';
                }
            },
            isDisabledButton(index) {
                if (this.fiches.length > 0) {
                    if (this.fiches[index].size === 'b' || this.fiches[index].size === 'c' || this.fiches[index].size === 'neck' || this.fiches[index].size === 'mini_a' || this.fiches[index].size === 'mini_b') {
                        return false;
                    }
                    return true;
                }
            },
            async captureSVGs() {
                let urls = _.flatMap(this.labels, (label) => {
                    let arr = [
                        label.frontLabelSVG,
                        label.backLabelSVG,
                    ];
                    if (label.neckLabelSVG) {
                        arr.push(label.neckLabelSVG);
                    }
                    return arr;
                });
                this.downloadConversionProgress.totalDownloads = urls.length;
                this.downloadConversionProgress.currentProcedure = 'DOWNLOAD';
                await PuppeteerDownloader.downloadSVGs(this.labels, this.$store);
            },
            makeNextPdf(index = 0) {
                const fiche = this.fiches[index];
                const config = {
                    printer: this.printer,
                    pdfSettings: this.settings.pdf_settings[fiche.size],
                    orientation: this.settings.orientation,
                    filename: this.$store.state.Settings.printer + '_' + this.productionProposalID + '_' + fiche.size + '_' + this.b2bOrB2c.toUpperCase()
                };
                this.downloadConversionProgress.currentProcedure = 'PDF';
                this.downloadConversionProgress.currentPDF = fiche.size;
                this.currentPdfPromise = PDFMaker
                    .makePDF( config, fiche.pages, fiche.size )
                    .then(() => {
                        if (this.fiches.length - 1 === index) {
                            this.loading = false;
                            this.downloadConversionProgress.reset();
                        } else {
                            this.makeNextPdf(index + 1);
                        }
                    })
                    .catch(err => {
                        console.log(err);
                    })
                    .finally(() => {
                        if (this.currentPdfPromise.isCancelled()) {
                            this.afterPdfCancel();
                        }
                    });
            },
            afterPdfCancel() {
                this.$notify({
                    title: 'Warning',
                    message: 'Rendering has been cancelled',
                    type: 'warning',
                });
                this.loading = false;
                this.downloadConversionProgress.reset();
            },
            makePDF(index) {
                this.loading = true;
                const fiche = this.fiches[index];
                this.downloadConversionProgress.currentProcedure = 'PDF';
                this.downloadConversionProgress.currentPDF = fiche.size;
                const config = {
                    printer: this.printer,
                    pdfSettings: this.settings.pdf_settings[fiche.size],
                    orientation: this.settings.orientation,
                    filename: this.$store.state.Settings.printer + '_' + this.productionProposalID + '_' + this.fiches[index].size + '_' + this.b2bOrB2c.toUpperCase()
                };
                this.currentPdfPromise = PDFMaker
                    .makePDF( config, this.fiches[index].pages, this.fiches[index].size )
                    .then(() => {
                        this.loading = false;
                    })
                    .catch(err => {
                        console.log(err);
                    })
                    .finally(() => {
                        if (this.currentPdfPromise.isCancelled()) {
                            this.afterPdfCancel();
                        }
                    });
            },
            goHome() {
                this.$router.push({
                    name: 'home',
                })
            }
        },
        data() {
            return {
                currentPdfPromise: false,
                downloadConversionProgress: DownloadConversionProgress,
                loading: false,
                productionProposalID: this.$route.params.proposal_id,
                productionProposal: false,
            }
        }
    }
</script>
