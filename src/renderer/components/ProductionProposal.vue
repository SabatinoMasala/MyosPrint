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
                        <el-button type="primary" size="small" @click="makePDF()">Get PDF</el-button>
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
    import FicheMaker from '@/helpers/FicheMaker'
    import PDFMaker from '@/helpers/PDFMaker'

    export default {
        computed: {
            fiches() {
                return FicheMaker.getFichesFromLabels(this.labels)
            },
            labels() {
                return this.bottleProposals.map((proposal) => {
                    console.log(proposal.orderBottle.designedBottle);
                    return {
                        amount:proposal.orderBottle.amount,
                        size: proposal.orderBottle.designedBottle.label.size.toLowerCase(),
                        frontLabel: proposal.orderBottle.designedBottle.frontLabel,
                        backLabel: proposal.orderBottle.designedBottle.backLabel,
                        neckLabel: proposal.orderBottle.designedBottle.neckLabel,
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
                     this.loading = false;
                })
                .catch((error) => {
                })
        },
        methods: {
            makePDF() {
                this.loading = true;
                PDFMaker.makePDF().then(() => {
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
