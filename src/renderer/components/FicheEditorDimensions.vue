<template>
    <el-row>
        <h2>Dimensions {{ name }}</h2>
        <el-col :span="12">
            <p>Width:</p>
            <el-input-number v-model="dimensions.width"></el-input-number>
        </el-col>
        <el-col :span="12">
            <p>Height:</p>
            <el-input-number v-model="dimensions.height"></el-input-number>
        </el-col>
    </el-row>
</template>
<script>
    export default {
        props: {
            dimensions: Object,
            name: String
        }
    }
</script>