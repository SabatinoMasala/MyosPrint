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
            fiches() {
                return FicheMaker.getFichesFromLabels(this.$store.state.Settings.printer, this.$store.state.Settings.sorting, this.labels)
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
            this.load();
        },
        methods: {
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
                        this.captureSVGs();
                    })
                    .catch((error) => {
                    })
            },
            updateRoute() {
                this.productionProposalID = this.$route.params.proposal_id;
                this.load();
            },
            getLoadingText() {
                if (this.downloadConversionProgress.currentProcedure === 'DOWNLOAD') {
                    return 'Downloading & converting: ' + this.downloadConversionProgress.downloads + '/' + this.downloadConversionProgress.totalDownloads;
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
                this.downloadConversionProgress.reset();
                this.makeNextPdf();
            },
            makeNextPdf(index = 0) {
                console.log('make next pdf', {index});
                const fiche = this.fiches[index];
                const filename = this.$store.state.Settings.printer + '_' + this.productionProposalID + '_' + fiche.size;
                PDFMaker.makePDF( this.$store, fiche.pages, fiche.size, filename ).then(() => {
                    if (this.fiches.length - 1 === index) {
                        this.loading = false;
                    } else {
                        this.makeNextPdf(index + 1);
                    }
                });
            },
            makePDF(index) {
                this.loading = true;
                const filename = this.$store.state.Settings.printer + '_' + this.productionProposalID + '_' + this.fiches[index].size;
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
