import store from 'store'

const state = {
    printer: 'roll',
    orientation: 'tr',
    pdf_blank_pages_before_labels: 0,
    pdf_blank_pages_after_labels: 0,
    svg_quality: 1000,
    sorting: 'labelling',
    extension: 'jpeg',
};

const mutations = {
    INIT_SETTINGS(state) {
        if (store.get('settings')) {
            const settings = store.get('settings');
            state = Object.assign(state, settings);
        }
    },
    UPDATE_SVG_QUALITY(state, value) {
        state.svg_quality = value;
    },
    UPDATE_PDF_BLANK_PAGES_BEFORE_LABELS(state, value) {
        state.pdf_blank_pages_before_labels = value;
    },
    UPDATE_PDF_BLANK_PAGES_AFTER_LABELS(state, value) {
        state.pdf_blank_pages_after_labels = value;
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
