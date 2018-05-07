<template>
    <el-dialog
            :close-on-click-modal="false"
            title="Quick settings"
            :before-close="closeModals"
            size="small"
            :visible="currentModal == 'modal-orientation'">
        <h2>
            Label orientation
        </h2>
        <el-select v-model="orientation" placeholder="Select orientation">
            <el-option
                    v-for="item in orientationOptions"
                    :key="item.value"
                    :label="item.label"
                    :disabled="item.disabled"
                    :value="item.value">
            </el-option>
        </el-select>

        <h2>
            Label sorting in PDF
        </h2>
        <el-select v-model="sorting" placeholder="Select sorting">
            <el-option
                    v-for="item in sortingOptions"
                    :key="item.value"
                    :label="item.label"
                    :disabled="item.disabled"
                    :value="item.value">
            </el-option>
        </el-select>
    </el-dialog>
</template>

<script>
    export default {
        computed: {
            sorting: {
                get() {
                    return this.$store.state.Settings.sorting
                },
                set(value) {
                    this.$store.commit('SWITCH_SORTING', value);
                }
            },
            currentModal() {
                return this.$store.state.Modals.current_modal
            },
            orientation: {
                get() {
                    return this.$store.state.Settings.orientation
                },
                set(value) {
                    this.$store.commit('SWITCH_ORIENTATION', value);
                }
            }
        },
        methods: {
            closeModals() {
                this.$store.commit('CLOSE_MODALS');
            }
        },
        data() {
            return {
                orientationOptions: [
                    {
                        value: 'tr',
                        label: 'Top right (default)',
                    },
                    {
                        value: 'tl',
                        label: 'Top Left',
                    }
                ],
                sortingOptions: [
                    {
                        value: 'labelling',
                        label: 'Neck first',
                    },
                    {
                        value: 'bottling',
                        label: 'Neck last',
                    }
                ]
            }
        },
    }
</script>
