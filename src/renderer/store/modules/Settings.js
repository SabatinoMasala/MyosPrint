const state = {
    printer: 'roll',
    pdf_blank_pages_before_labels: 0,
    svg_quality: 1000,
    extension: 'jpeg',
};

const mutations = {
    UPDATE_SVG_QUALITY(state, value) {
        state.svg_quality = value;
    },
    UPDATE_PDF_BLANK_PAGES_BEFORE_LABELS(state, value) {
        state.pdf_blank_pages_before_labels = value;
    },
    SWITCH_PRINTER(state, value) {
        switch (value) {
            case 'roll':
                state.printer = 'roll';
                break;
            case 'classic':
                state.printer = 'classic';
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
