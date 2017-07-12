<template>
    <div>

        <el-menu theme="dark" class="el-menu-demo" mode="horizontal">
            <el-menu-item index="1" @click="goHome()">
                <i class="el-icon-caret-left"></i>
                Back home
            </el-menu-item>
        </el-menu>

        <div style="margin: 50px;">
            <h1>Production proposal <strong style="border-bottom: 1px #000 dashed;">{{ productionProposalID }}</strong></h1>
            <h2>Fiches</h2>
            <el-table :data="fiches" empty-text="No fiches" v-loading.body="loading">
                <el-table-column
                        prop="size"
                        label="Size">
                </el-table-column>
                <el-table-column
                        prop="pages"
                        label="Number of pages">
                </el-table-column>
                <el-table-column
                        label="Operations">
                    <template scope="scope">
                        <el-button type="primary" size="small" @click="makePDF(scope.$index)">Get PDF</el-button>
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
    import SVGConvert from '@/helpers/SVGConvert'

    export default {
        computed: {
            fiches() {
                return FicheMaker.getFichesFromLabels(this.labels)
            },
            labels() {
                return this.bottleProposals.map((proposal) => {
                    return {
                        amount:proposal.orderBottle.amount,
                        size: proposal.orderBottle.designedBottle.label.size.toLowerCase(),
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
                        return order.bottleProposals
                    }))
                }
                return []
            }
        },
        mounted() {
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
        methods: {
            startDownload() {
                let downloads = [];
                this.labels.forEach((label) => {
                    downloads.push(
                        Promise.all(Download.downloadSVGFromLabel(label))
                    );
                });
                Promise.all(downloads).then(() => {
                    let conversions = [];
                    this.labels.forEach((label) => {
                        conversions.push(
                            Promise.all(SVGConvert.convertLabelSVGToPNG(label))
                        );
                    });
                    return Promise.all(conversions)
                }).then(() => {
                    this.loading = false;
                }).error((e) => {
                    console.log(e);
                })
            },
            makePDF(index) {
                let pages = [
                {
                    front: [
                        Dir.getImagesDir() + '/0f48228aeae3ec73d2f45a9572dfd807.png',
                        Dir.getImagesDir() + '/0f48228aeae3ec73d2f45a9572dfd807.png',
                        Dir.getImagesDir() + '/0f48228aeae3ec73d2f45a9572dfd807.png',
                        Dir.getImagesDir() + '/0f48228aeae3ec73d2f45a9572dfd807.png',
                        Dir.getImagesDir() + '/0f48228aeae3ec73d2f45a9572dfd807.png',
                    ],
                    back: [
                        Dir.getImagesDir() + '/30c4692ab994fc0e9ed000e88a8423a0.png',
                        Dir.getImagesDir() + '/30c4692ab994fc0e9ed000e88a8423a0.png',
                        Dir.getImagesDir() + '/30c4692ab994fc0e9ed000e88a8423a0.png',
                        Dir.getImagesDir() + '/30c4692ab994fc0e9ed000e88a8423a0.png',
                        Dir.getImagesDir() + '/30c4692ab994fc0e9ed000e88a8423a0.png',
                    ],
                    neck: [
                        Dir.getImagesDir() + '/3254058dacfb73c65ec89f8eb5a112a3.png',
                        Dir.getImagesDir() + '/3254058dacfb73c65ec89f8eb5a112a3.png',
                        Dir.getImagesDir() + '/3254058dacfb73c65ec89f8eb5a112a3.png',
                        Dir.getImagesDir() + '/3254058dacfb73c65ec89f8eb5a112a3.png',
                        Dir.getImagesDir() + '/3254058dacfb73c65ec89f8eb5a112a3.png',
                    ]
                },
                {
                    front: [
                        Dir.getImagesDir() + '/0f48228aeae3ec73d2f45a9572dfd807.png',
                        Dir.getImagesDir() + '/0f48228aeae3ec73d2f45a9572dfd807.png',
                        Dir.getImagesDir() + '/0f48228aeae3ec73d2f45a9572dfd807.png',
                        Dir.getImagesDir() + '/0f48228aeae3ec73d2f45a9572dfd807.png',
                        Dir.getImagesDir() + '/0f48228aeae3ec73d2f45a9572dfd807.png',
                    ],
                    back: [
                        Dir.getImagesDir() + '/30c4692ab994fc0e9ed000e88a8423a0.png',
                        Dir.getImagesDir() + '/30c4692ab994fc0e9ed000e88a8423a0.png',
                        Dir.getImagesDir() + '/30c4692ab994fc0e9ed000e88a8423a0.png',
                        Dir.getImagesDir() + '/30c4692ab994fc0e9ed000e88a8423a0.png',
                        Dir.getImagesDir() + '/30c4692ab994fc0e9ed000e88a8423a0.png',
                    ],
                    neck: [
                        Dir.getImagesDir() + '/3254058dacfb73c65ec89f8eb5a112a3.png',
                        Dir.getImagesDir() + '/3254058dacfb73c65ec89f8eb5a112a3.png',
                        Dir.getImagesDir() + '/3254058dacfb73c65ec89f8eb5a112a3.png',
                        Dir.getImagesDir() + '/3254058dacfb73c65ec89f8eb5a112a3.png',
                        Dir.getImagesDir() + '/3254058dacfb73c65ec89f8eb5a112a3.png',
                    ]
                },
                {
                    front: [
                        Dir.getImagesDir() + '/0f48228aeae3ec73d2f45a9572dfd807.png',
                        Dir.getImagesDir() + '/0f48228aeae3ec73d2f45a9572dfd807.png',
                        Dir.getImagesDir() + '/0f48228aeae3ec73d2f45a9572dfd807.png',
                        Dir.getImagesDir() + '/0f48228aeae3ec73d2f45a9572dfd807.png',
                        Dir.getImagesDir() + '/0f48228aeae3ec73d2f45a9572dfd807.png',
                    ],
                    back: [
                        Dir.getImagesDir() + '/30c4692ab994fc0e9ed000e88a8423a0.png',
                        Dir.getImagesDir() + '/30c4692ab994fc0e9ed000e88a8423a0.png',
                        Dir.getImagesDir() + '/30c4692ab994fc0e9ed000e88a8423a0.png',
                        Dir.getImagesDir() + '/30c4692ab994fc0e9ed000e88a8423a0.png',
                        Dir.getImagesDir() + '/30c4692ab994fc0e9ed000e88a8423a0.png',
                    ],
                    neck: [
                        Dir.getImagesDir() + '/3254058dacfb73c65ec89f8eb5a112a3.png',
                        Dir.getImagesDir() + '/3254058dacfb73c65ec89f8eb5a112a3.png',
                        Dir.getImagesDir() + '/3254058dacfb73c65ec89f8eb5a112a3.png',
                        Dir.getImagesDir() + '/3254058dacfb73c65ec89f8eb5a112a3.png',
                        Dir.getImagesDir() + '/3254058dacfb73c65ec89f8eb5a112a3.png',
                    ]
                }];
                this.loading = true;
                PDFMaker.makePDF(pages).then(() => {
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
                loading: true,
                productionProposalID: this.$route.params.proposal_id,
                productionProposal: false,
                tableData: [{
                    fiche: '2016-05-03',
                    bottle_amount: 100,
                }]
            }
        }
    }
</script>
