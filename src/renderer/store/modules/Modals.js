const state = {
    current_modal: false,
};

const mutations = {
    OPEN_MODAL(state, value) {
        state.current_modal = value;
    },
    CLOSE_MODALS(state) {
        state.current_modal = false;
    }
};

const actions = {

};

export default {
    state,
    mutations,
    actions
}
