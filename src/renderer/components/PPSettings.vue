<template>
    <el-dialog
            :close-on-click-modal="false"
            title="Settings"
            :before-close="closeModals"
            size="small"
            :visible="currentModal == 'modal-settings'">
        <el-row>
            <el-col :span="24">
                <h1>
                    General settings
                </h1>
            </el-col>
            <el-col :span="24">
                <h2>
                    Printer
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
            </el-col>
        </el-row>
        <el-row class="mt-1">
            <el-col :span="24">
                <h1>Label settings</h1>
            </el-col>
            <el-col :span="12">
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
            </el-col>
            <el-col :span="12">
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
            </el-col>
        </el-row>
        <el-row class="mt-1">
            <el-col :span="24">
                <h1>PDF Settings</h1>
                <el-select v-model="currentSize">
                    <el-option value="b" label="b"></el-option>
                    <el-option value="c" label="c"></el-option>
                    <el-option value="mini_a" label="mini_a"></el-option>
                    <el-option value="mini_b" label="mini_b"></el-option>
                    <el-option value="neck" label="neck"></el-option>
                </el-select>
            </el-col>
            <el-col :span="12">
                <h2>
                    Blank pages start
                </h2>
                <el-input-number v-model="blankPagesStart" :min="0"></el-input-number>
            </el-col>
            <el-col :span="12">
                <h2>
                    Blank pages end
                </h2>
                <el-input-number v-model="blankPagesEnd" :min="0"></el-input-number>
            </el-col>
            <el-col :span="12">
                <h2>
                    Blackmark pages start
                </h2>
                <el-input-number v-model="blackmarkPagesStart" :min="0"></el-input-number>
            </el-col>
            <el-col :span="12">
                <h2>
                    Blackmark pages end
                </h2>
                <el-input-number v-model="blackmarkPagesEnd" :min="0"></el-input-number>
            </el-col>
            <el-col :span="24">
                <h2>Blackmark / blanco order</h2>
                <el-checkbox label="Blackmark first at the start" v-model="blackmark_start_first" />
                <el-checkbox label="Blackmark first at the end" v-model="blackmark_end_first" />
            </el-col>
        </el-row>
    </el-dialog>
</template>

<script>
    export default {
        computed: {
            currentModal() {
                return this.$store.state.Modals.current_modal
            },
            blankPagesStart: {
                get() {
                    return this.$store.state.Settings.pdf_settings[this.currentSize].blank_pages_before_labels
                },
                set(value) {
                    if (this.$store.state.Settings.pdf_settings[this.currentSize].blank_pages_before_labels !== value) {
                        this.$store.commit('UPDATE_PDF_BLANK_PAGES_BEFORE_LABELS', {
                            pdf: this.currentSize,
                            value
                        });
                    }
                }
            },
            blankPagesEnd: {
                get() {
                    return this.$store.state.Settings.pdf_settings[this.currentSize].blank_pages_after_labels
                },
                set(value) {
                    if (this.$store.state.Settings.pdf_settings[this.currentSize].blank_pages_after_labels !== value) {
                        this.$store.commit('UPDATE_PDF_BLANK_PAGES_AFTER_LABELS', {
                            pdf: this.currentSize,
                            value
                        });
                    }
                }
            },
            blackmarkPagesStart: {
                get() {
                    return this.$store.state.Settings.pdf_settings[this.currentSize].blackmark_pages_before_labels
                },
                set(value) {
                    if (this.$store.state.Settings.pdf_settings[this.currentSize].blackmark_pages_before_labels !== value) {
                        this.$store.commit('UPDATE_PDF_BLACKMARK_PAGES_BEFORE_LABELS', {
                            pdf: this.currentSize,
                            value
                        });
                    }
                }
            },
            blackmarkPagesEnd: {
                get() {
                    return this.$store.state.Settings.pdf_settings[this.currentSize].blackmark_pages_after_labels
                },
                set(value) {
                    if (this.$store.state.Settings.pdf_settings[this.currentSize].blackmark_pages_after_labels !== value) {
                        this.$store.commit('UPDATE_PDF_BLACKMARK_PAGES_AFTER_LABELS', {
                            pdf: this.currentSize,
                            value
                        });
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
            blackmark_start_first: {
                get() {
                    return this.$store.state.Settings.pdf_settings[this.currentSize].blackmark_start_first
                },
                set(value) {
                    this.$store.commit('UPDATE_PDF_BLACKMARK_START_FIRST', {
                        pdf: this.currentSize,
                        value
                    });
                }
            },
            blackmark_end_first: {
                get() {
                    return this.$store.state.Settings.pdf_settings[this.currentSize].blackmark_end_first
                },
                set(value) {
                    this.$store.commit('UPDATE_PDF_BLACKMARK_END_FIRST', {
                        pdf: this.currentSize,
                        value
                    });
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
                currentSize: 'b',
                printerOptions: [
                    {
                        value: 'classic',
                        label: 'Classic printer',
                    },
                    {
                        value: 'roll',
                        label: 'Non-blackmark printer',
                    },
                    {
                        value: 'blackmark',
                        label: 'Blackmark printer',
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
