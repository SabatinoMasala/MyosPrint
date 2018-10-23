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
            </el-col>
            <el-col :span="12">
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
            <el-col :span="12">
                <el-checkbox label="Set as default printer" v-model="isPrinterDefault" />
            </el-col>
        </el-row>
        <el-row class="mt-1">
            <el-col :span="24">
                <h1>Label settings <small>{{ printer }} {{ b2bOrB2c }}</small></h1>
            </el-col>
            <el-col :span="24">
                <el-select v-model="b2bOrB2c">
                    <el-option value="b2c" label="b2c"></el-option>
                    <el-option value="b2b" label="b2b"></el-option>
                </el-select>
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
                <el-checkbox label="Reversed" v-model="reversed"></el-checkbox>
            </el-col>
        </el-row>
        <el-row class="mt-1">
            <el-col :span="24">
                <h2>PDF Settings <small>{{ printer }} {{ b2bOrB2c }} {{ currentSize }}</small></h2>
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
            <template v-if="printer === 'blackmark'">
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
            </template>
        </el-row>
    </el-dialog>
</template>

<script>
    export default {
        computed: {
            reversed: {
                get() {
                    return this.settings.reversed;
                },
                set(value) {
                    this.$store.commit('UPDATE_REVERSED', {
                        pdf: this.currentSize,
                        printer: this.printer,
                        b2bOrB2c: this.b2bOrB2c,
                        value
                    });
                }
            },
            isPrinterDefault: {
                get() {
                    return this.$store.state.Settings.printer === this.printer;
                },
                set(value) {
                    this.$store.commit('UPDATE_PRINTER', this.printer);
                }
            },
            settings() {
                return this.$store.state.Settings.config[this.printer][this.b2bOrB2c];
            },
            pdfSettings() {
                return this.settings.pdf_settings[this.currentSize];
            },
            currentModal() {
                return this.$store.state.Modals.current_modal
            },
            blankPagesStart: {
                get() {
                    return this.pdfSettings.blank_pages_before_labels
                },
                set(value) {
                    if (this.pdfSettings.blank_pages_before_labels !== value) {
                        this.$store.commit('UPDATE_PDF_BLANK_PAGES_BEFORE_LABELS', {
                            pdf: this.currentSize,
                            printer: this.printer,
                            b2bOrB2c: this.b2bOrB2c,
                            value
                        });
                    }
                }
            },
            blankPagesEnd: {
                get() {
                    return this.pdfSettings.blank_pages_after_labels
                },
                set(value) {
                    if (this.pdfSettings.blank_pages_after_labels !== value) {
                        this.$store.commit('UPDATE_PDF_BLANK_PAGES_AFTER_LABELS', {
                            pdf: this.currentSize,
                            printer: this.printer,
                            b2bOrB2c: this.b2bOrB2c,
                            value
                        });
                    }
                }
            },
            blackmarkPagesStart: {
                get() {
                    return this.pdfSettings.blackmark_pages_before_labels
                },
                set(value) {
                    if (this.pdfSettings.blackmark_pages_before_labels !== value) {
                        this.$store.commit('UPDATE_PDF_BLACKMARK_PAGES_BEFORE_LABELS', {
                            pdf: this.currentSize,
                            printer: this.printer,
                            b2bOrB2c: this.b2bOrB2c,
                            value
                        });
                    }
                }
            },
            blackmarkPagesEnd: {
                get() {
                    return this.pdfSettings.blackmark_pages_after_labels
                },
                set(value) {
                    if (this.pdfSettings.blackmark_pages_after_labels !== value) {
                        this.$store.commit('UPDATE_PDF_BLACKMARK_PAGES_AFTER_LABELS', {
                            pdf: this.currentSize,
                            printer: this.printer,
                            b2bOrB2c: this.b2bOrB2c,
                            value
                        });
                    }
                }
            },
            orientation: {
                get() {
                    return this.settings.orientation
                },
                set(value) {
                    this.$store.commit('UPDATE_ORIENTATION', {
                        pdf: this.currentSize,
                        printer: this.printer,
                        b2bOrB2c: this.b2bOrB2c,
                        value
                    });
                }
            },
            sorting: {
                get() {
                    return this.settings.sorting
                },
                set(value) {
                    this.$store.commit('UPDATE_SORTING', {
                        pdf: this.currentSize,
                        printer: this.printer,
                        b2bOrB2c: this.b2bOrB2c,
                        value
                    });
                }
            },
            blackmark_start_first: {
                get() {
                    return this.pdfSettings.blackmark_start_first
                },
                set(value) {
                    this.$store.commit('UPDATE_PDF_BLACKMARK_START_FIRST', {
                        pdf: this.currentSize,
                        printer: this.printer,
                        b2bOrB2c: this.b2bOrB2c,
                        value
                    });
                }
            },
            blackmark_end_first: {
                get() {
                    return this.pdfSettings.blackmark_end_first
                },
                set(value) {
                    this.$store.commit('UPDATE_PDF_BLACKMARK_END_FIRST', {
                        pdf: this.currentSize,
                        printer: this.printer,
                        b2bOrB2c: this.b2bOrB2c,
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
                printer: 'roll',
                currentSize: 'b',
                b2bOrB2c: 'b2c',
                printerOptions: [
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
