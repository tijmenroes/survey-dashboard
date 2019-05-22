<template>
    <div v-if="$store.state.filters.length > 0">
        <h3>FILTERS</h3>

        <div class="filterList">

        <div :key="index"
        class="chippie" v-for="(filter,index)  in $store.state.filters">
        <span>Q{{filter.Question}}: {{filter.Answer.toString()}}</span>
        <v-icon right small @click="delFilter(index)"> close</v-icon>
        </div>

        </div>
    </div>
</template>

<script>
    export default {
        name: "FilterList",
        methods:{
            delFilter(number) {
                this.$store.commit('delFilter', number);
                this.$store.commit('ConfigureAnswers', number);
            },
            editFilter(number) {
                this.$store.commit('delFilter', number);
                this.$store.commit('ConfigureAnswers', number);
            }
        }
    }
</script>

<style scoped>
    .filterList {
        margin-top: 15px;
        margin-bottom: 15px;
    }
    h3{
        font-size: 12px;
        font-weight: 700;
        color: #40475f;
        padding: 0 0 10px 0;
        border-bottom: 1px solid #e3e8e9;
        text-transform: uppercase;
        letter-spacing: 1px;
    }
.chippie{
    background: #fff;
    display: inline-block;
    border-radius: 22px;
    padding: 8px 20px;
    border: 2px solid #00bfa5 !important;
}
</style>
