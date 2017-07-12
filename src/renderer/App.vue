<template>
    <div id="app">
        <router-view></router-view>
    </div>
</template>

<script>
    export default {
        name: 'myosprint'
    }
</script>

<style lang="scss">
    .btn-block {
        width: 100%;
    }
    .text-center {
        text-align: center;
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
    .mt-0 {
        margin-top: 0;
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