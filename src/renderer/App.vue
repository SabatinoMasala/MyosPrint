<template>
    <div id="app">
        <router-view></router-view>
    </div>
</template>

<script>
    import store from 'store';
    export default {
        name: 'myosprint',
        beforeCreate() {
            this.$store.commit('INIT_SETTINGS');
        },
        mounted() {
            this.$store.subscribe((mutation, state) => {
                store.set('settings', state.Settings);
            });
        }
    }
</script>

<style lang="scss">
    .btn-block {
        width: 100%;
    }
    .text-center {
        text-align: center;
    }
    .text-right {
        text-align: right;
    }
    .d-flex {
        display: flex !important;
    }
    .m-auto {
        margin: auto !important;
    }
    .mb-auto {
        margin-bottom: auto !important;
    }
    .mt-auto {
        margin-top: auto !important;
    }
    .mr-auto {
        margin-right: auto !important;
    }
    .ml-auto {
        margin-left: auto !important;
    }
    .mb-1 {
        margin-bottom: 1rem;
    }
    .mb-2 {
        margin-bottom: 2rem;
    }
    .mb-3 {
        margin-bottom: 3rem;
    }
    .mt-0 {
        margin-top: 0;
    }
    .mt-1 {
        margin-top: 1rem;
    }
    .mt-2 {
        margin-top: 2rem;
    }
    .mt-3 {
        margin-top: 3rem;
    }
    .pt-0 {
        padding-top: 0;
    }
    body {
        margin: 0;
        font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
    }
    .text-danger {
        color: #ff4949;
    }
</style>