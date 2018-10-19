import store from 'store'

const state = {
    printer: 'roll',
    orientation: 'tr',
    pdf_settings: {
        b: {
            blackmark_start_first: true,
            blackmark_end_first: true,
            blank_pages_before_labels: 0,
            blank_pages_after_labels: 0,
            blackmark_pages_before_labels: 0,
            blackmark_pages_after_labels: 0,
        },
        c: {
            blackmark_start_first: true,
            blackmark_end_first: true,
            blank_pages_before_labels: 0,
            blank_pages_after_labels: 0,
            blackmark_pages_before_labels: 0,
            blackmark_pages_after_labels: 0,
        },
        mini_a: {
            blackmark_start_first: true,
            blackmark_end_first: true,
            blank_pages_before_labels: 0,
            blank_pages_after_labels: 0,
            blackmark_pages_before_labels: 0,
            blackmark_pages_after_labels: 0,
        },
        mini_b: {
            blackmark_start_first: true,
            blackmark_end_first: true,
            blank_pages_before_labels: 0,
            blank_pages_after_labels: 0,
            blackmark_pages_before_labels: 0,
            blackmark_pages_after_labels: 0,
        },
        neck: {
            blackmark_start_first: true,
            blackmark_end_first: true,
            blank_pages_before_labels: 0,
            blank_pages_after_labels: 0,
            blackmark_pages_before_labels: 0,
            blackmark_pages_after_labels: 0,
        }
    },
    svg_quality: 1000,
    sorting: 'labelling',
    extension: 'jpeg',
};

const mutations = {
    INIT_SETTINGS(state) {
        if (store.get('settings')) {
            const settings = store.get('settings');
            state = Object.assign(state, {
                printer: settings.printer,
                orientation: settings.orientation,
                blackmark_start_first: settings.blackmark_start_first,
                blackmark_end_first: settings.blackmark_end_first,
                pdf_settings: Object.assign(state.pdf_settings, settings.pdf_settings),
                svg_quality: settings.svg_quality,
                sorting: settings.sorting,
                extension: settings.extension
            });
        }
    },
    UPDATE_SVG_QUALITY(state, value) {
        state.svg_quality = value;
    },
    UPDATE_PDF_BLANK_PAGES_BEFORE_LABELS(state, payload) {
        const {pdf, value} = payload;
        state.pdf_settings[pdf].blank_pages_before_labels = value;
    },
    UPDATE_PDF_BLANK_PAGES_AFTER_LABELS(state, payload) {
        const {pdf, value} = payload;
        state.pdf_settings[pdf].blank_pages_after_labels = value;
    },
    UPDATE_PDF_BLACKMARK_PAGES_BEFORE_LABELS(state, payload) {
        const {pdf, value} = payload;
        state.pdf_settings[pdf].blackmark_pages_before_labels = value;
    },
    UPDATE_PDF_BLACKMARK_START_FIRST(state, payload) {
        const {pdf, value} = payload;
        state.pdf_settings[pdf].blackmark_start_first = value;
    },
    UPDATE_PDF_BLACKMARK_END_FIRST(state, payload) {
        const {pdf, value} = payload;
        state.pdf_settings[pdf].blackmark_end_first = value;
    },
    UPDATE_PDF_BLACKMARK_PAGES_AFTER_LABELS(state, payload) {
        const {pdf, value} = payload;
        state.pdf_settings[pdf].blackmark_pages_after_labels = value;
    },
    SWITCH_PRINTER(state, value) {
        switch (value) {
            case 'roll':
                state.printer = 'roll';
                break;
            case 'blackmark':
                state.printer = 'blackmark';
                break;
            case 'classic':
                state.printer = 'classic';
                break;
        }
    },
    SWITCH_ORIENTATION(state, value) {
        switch (value) {
            case 'tl':
                state.orientation = 'tl';
                break;
            case 'tr':
                state.orientation = 'tr';
                break;
        }
    },
    SWITCH_SORTING(state, value) {
        switch (value) {
            case 'labelling':
                state.sorting = 'labelling';
                break;
            case 'bottling':
                state.sorting = 'bottling';
                break;
        }
    }
};

const actions = {

};

export default {
    state,
    mutations,
    actions
}
