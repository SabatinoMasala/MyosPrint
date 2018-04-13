<template>
    <el-dialog
            :close-on-click-modal="false"
            title="Choose orientation"
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
    </el-dialog>
</template>

<script>
    export default {
        computed: {
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
                ]
            }
        },
    }
</script>
