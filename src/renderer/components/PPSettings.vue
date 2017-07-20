<template>
    <el-dialog
            :close-on-click-modal="false"
            title="Settings"
            :before-close="closeModals"
            size="small"
            :visible="currentModal == 'modal-settings'">
        <h2>
            Fiches
        </h2>
        <el-select v-model="printer" placeholder="Select">
            <el-option
                    v-for="item in printerOptions"
                    :key="item.value"
                    :label="item.label"
                    :disabled="item.disabled"
                    :value="item.value">
            </el-option>
        </el-select>
        <h2>
            PDF Blank pages
        </h2>
        <el-input-number v-model="blankPages" :min="0"></el-input-number>
        <h2>
            SVG Quality
        </h2>
        <el-input-number v-model="svgQuality" :step="50" :min="0"></el-input-number>
    </el-dialog>
</template>

<script>
    export default {
        computed: {
            currentModal() {
                return this.$store.state.Modals.current_modal
            },
            blankPages: {
                get() {
                    return this.$store.state.Settings.pdf_blank_pages_before_labels
                },
                set(value) {
                    if (this.$store.state.Settings.pdf_blank_pages_before_labels !== value) {
                        this.$store.commit('UPDATE_PDF_BLANK_PAGES_BEFORE_LABELS', value);
                    }
                }
            },
            svgQuality: {
                get() {
                    return this.$store.state.Settings.svg_quality
                },
                set(value) {
                    if (this.$store.state.Settings.svg_quality !== value) {
                        this.$store.commit('UPDATE_SVG_QUALITY', value);
                    }
                }
            },
            printer: {
                get() {
                    return this.$store.state.Settings.printer
                },
                set(value) {
                    this.$store.commit('SWITCH_PRINTER', value);
                }
            },
        },
        methods: {
            closeModals() {
                this.$store.commit('CLOSE_MODALS');
            }
        },
        data() {
            return {
                printerOptions: [
                    {
                        value: 'classic',
                        label: 'Classic printer',
                    },
                    {
                        value: 'roll',
                        label: 'Roll printer',
                    }
                ]
            }
        },
    }
</script>
