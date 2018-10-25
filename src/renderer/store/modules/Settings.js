import store from 'store';
import PrintConfig from '@/config/PrintConfig';

const state = {
    printer: 'roll',
    config: {
        roll: {
            b2c: PrintConfig('roll_b2c'),
            b2b: PrintConfig('roll_b2b'),
        },
        blackmark: {
            b2c: PrintConfig('blackmark_b2c'),
            b2b: PrintConfig('blackmark_b2b'),
        }
    }
};

const mutations = {
    INIT_SETTINGS(state) {
        const settings = store.get('settings');
        const overrides = {};
        if (settings.printer) { overrides.printer = settings.printer; }
        state = Object.assign(state, overrides);
    },
    UPDATE_PDF_BLANK_PAGES_BEFORE_LABELS(state, payload) {
        const {pdf, value, b2bOrB2c, printer} = payload;
        state.config[printer][b2bOrB2c].pdf_settings[pdf].blank_pages_before_labels = value;
    },
    UPDATE_PDF_BLANK_PAGES_AFTER_LABELS(state, payload) {
        const {pdf, value, printer, b2bOrB2c} = payload;
        state.config[printer][b2bOrB2c].pdf_settings[pdf].blank_pages_after_labels = value;
    },
    UPDATE_PDF_BLACKMARK_PAGES_BEFORE_LABELS(state, payload) {
        const {pdf, value, b2bOrB2c, printer} = payload;
        state.config[printer][b2bOrB2c].pdf_settings[pdf].blackmark_pages_before_labels = value;
    },
    UPDATE_PDF_BLACKMARK_START_FIRST(state, payload) {
        const {pdf, value, b2bOrB2c, printer} = payload;
        state.config[printer][b2bOrB2c].pdf_settings[pdf].blackmark_start_first = value;
    },
    UPDATE_PDF_BLACKMARK_END_FIRST(state, payload) {
        const {pdf, value, b2bOrB2c, printer} = payload;
        state.config[printer][b2bOrB2c].pdf_settings[pdf].blackmark_end_first = value;
    },
    UPDATE_PDF_BLACKMARK_PAGES_AFTER_LABELS(state, payload) {
        const {pdf, value, b2bOrB2c, printer} = payload;
        state.config[printer][b2bOrB2c].pdf_settings[pdf].blackmark_pages_after_labels = value;
    },
    UPDATE_PRINTER(state, value) {
        switch (value) {
            case 'roll':
                state.printer = 'roll';
                break;
            case 'blackmark':
                state.printer = 'blackmark';
                break;
        }
    },
    UPDATE_ORIENTATION(state, payload) {
        const {pdf, value, b2bOrB2c, printer} = payload;
        state.config[printer][b2bOrB2c].orientation = value;
    },
    UPDATE_SORTING(state, payload) {
        const {pdf, value, b2bOrB2c, printer} = payload;
        state.config[printer][b2bOrB2c].sorting = value;
    },
    UPDATE_REVERSED(state, payload) {
        const {pdf, value, b2bOrB2c, printer} = payload;
        state.config[printer][b2bOrB2c].reversed = value;
    }
};

const actions = {

};

export default {
    state,
    mutations,
    actions
}
