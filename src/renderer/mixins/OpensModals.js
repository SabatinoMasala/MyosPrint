export default {
    methods: {
        openModal(modal) {
            this.$store.commit('OPEN_MODAL', modal)
        }
    }
}