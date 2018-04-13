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
            orientation: {
                get() {
                    return this.$store.state.Settings.orientation
                },
                set(value) {
                    this.$store.commit('SWITCH_ORIENTATION', value);
                }
            },
            sorting: {
                get() {
                    return this.$store.state.Settings.sorting
                },
                set(value) {
                    this.$store.commit('SWITCH_SORTING', value);
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
                ],
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
                        label: 'Order Labelling',
                    },
                    {
                        value: 'bottling',
                        label: 'Order Bottling',
                    }
                ]
            }
        },
    }
</script>
