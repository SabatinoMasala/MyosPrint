const state = {
    fiche: {}
};

const mutations = {
    OPEN_FICHE(state, value) {
        state.fiche = value;
    }
};

const getters = {
    canvasDimensions(state) {
        return state.fiche.size;
    },
    slotsFront(state) {
        return state.fiche.slots.front;
    },
    slotsBack(state) {
        return state.fiche.slots.back;
    },
    dimensionsFront(state) {
        return state.fiche.dimensions.front;
    },
    dimensionsBack(state) {
        return state.fiche.dimensions.back;
    }
};

// TODO SAVE

export default {
    state,
    mutations,
    getters,
    namespaced: true
}
