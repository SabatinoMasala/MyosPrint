const state = {
    printer: 'classic'
};

const mutations = {
    SWITCH_PRINTER(state, value) {
        switch (value) {
            case 'roll':
                state.printer = 'roll';
                break;
            case 'classic':
                state.printer = 'classic';
                break;
        }
    },
    SWITCH_TO_CLASSIC_PRINTER (state) {
        state.printer = 'classic';
    },
    SWITCH_TO_ROLL_PRINTER (state) {
        state.printer = 'roll';
    }
};
const actions = {

};

export default {
    state,
    mutations,
    actions
}
