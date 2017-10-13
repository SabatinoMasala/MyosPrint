<template>
    <el-row>
        <h2>Slot front #{{ index + 1 }}</h2>
        <el-col :span="8">
            <p>X value</p>
            <el-input-number v-model="currentSlot.x"></el-input-number>
        </el-col>
        <el-col :span="8">
            <p>Y value</p>
            <el-input-number v-model="currentSlot.y"></el-input-number>
        </el-col>
        <el-col :span="8">
            <p>Rotation</p>
            <el-select v-model="currentSlot.rotation">
                <el-option
                        label="0deg"
                        :value="0"
                ></el-option>
                <el-option
                        label="90deg"
                        :value="90"
                ></el-option>
            </el-select>
        </el-col>
    </el-row>
</template>
<script>
    export default {
        props: {
            currentSlot: Object,
            index: Number
        }
    }
</script>