<template>
    <div class="d-flex" style="height: 100vh">
        <div class="m-auto">
            <h1 class="mt-0 text-center">Enter production proposal ID to get started</h1>
            <el-row :gutter="10">
                <el-col :span="12" :offset="2">
                    <el-input :disabled="isLoading" placeholder="Production proposal ID" v-model="productionProposalID"></el-input>
                </el-col>
                <el-col :span="8">
                    <el-button :loading="isLoading" @click.stop.prevent="getProductionProposal()" class="btn-block" type="primary" :disabled="!canContinue">
                        <span v-if="!isLoading">Get proposal</span>
                        <span v-else>Loading proposal</span>
                    </el-button>
                </el-col>
            </el-row>
            <div v-if="history.length > 0">
                <el-card class="history">
                    <div slot="header">History</div>
                    <ul>
                        <li v-for="item in history">
                            <router-link :to="getLink(item)">
                                <el-button type="text">{{ item }}</el-button>
                            </router-link>
                        </li>
                    </ul>
                </el-card>
            </div>
            <div class="version">
                MyosPrint {{ getVersion() }}
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
    .version {
        opacity: 0.4;
        position: fixed;
        bottom: 15px;
        right: 15px;
    }
    .history {
        margin-top: 30px;
        ul {
            margin: 0;
            padding: 0;
            list-style-type: none;
        }
    }
</style>

<script>

    const packagejson = require('../../../package.json');
    import store from 'store';
    import API from '@/helpers/api'

    export default {
        computed: {
            canContinue() {
                return this.productionProposalID.length > 0
            }
        },
        mounted() {
        },
        methods: {
            getVersion() {
                return packagejson.version;
            },
            getLink(item) {
                return {
                    name: 'pp-detail',
                    params: {
                        proposal_id: item
                    }
                }
            },
            getProductionProposal() {
                this.isLoading = true;
                this.$http.get(API + '/production-proposals/' + this.productionProposalID)
                    .then((data) => {
                        let history = store.get('pp-history') || [];
                        history.unshift(this.productionProposalID);
                        history = history.splice(0, 3);
                        store.set('pp-history', history);
                        this.$router.push({
                            name: 'pp-detail',
                            params: {
                                proposal_id: this.productionProposalID
                            }
                        })
                    })
                    .catch((error) => {
                        this.$message({
                            showClose: true,
                            message: 'This ID is invalid',
                            type: 'error'
                        });
                        this.isLoading = false;
                    })
            }
        },
        data() {
            return {
                history: store.get('pp-history') || [],
                isLoading: false,
                productionProposalID: ''
            }
        }
    }
</script>
