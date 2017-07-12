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
        </div>
    </div>
</template>

<script>

    import API from '@/helpers/api'

    export default {
        computed: {
            canContinue() {
                return this.productionProposalID.length > 0
            }
        },
        methods: {
            getProductionProposal() {
                this.isLoading = true;
                this.$http.get(API + '/production-proposals/' + this.productionProposalID)
                    .then((data) => {
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
                isLoading: false,
                productionProposalID: ''
            }
        }
    }
</script>
