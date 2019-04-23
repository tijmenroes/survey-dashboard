<template>
    <div></div>
                                        <span v-for="(button,index) in buttons" v-show="chart.menuShow">
              <v-btn @click="menuNumber = index" flat depressed>{{button}}</v-btn>
                                            </span>
    <div v-if="menuNumber === 0">
        <v-layout row wrap>
            <v-flex v-for="(option, optionIndex) in options" xs3 md4 lg2 >
                <v-btn fab flat @click="toLine(i, optionIndex)">
                    <v-icon v-if="chart.chartType === optionIndex" color="red">{{option.icon}}</v-icon>
                    <v-icon v-else color="#707171">{{option.icon}}</v-icon>
                </v-btn>
            </v-flex>
        </v-layout>

        <v-btn color="#BDC3C6" class="text-none">Discard</v-btn>
        <v-btn color="#475A64" class="text-none" dark @click="chart.menuShow =! chart.menuShow">Save</v-btn>
    </div>

    <v-layout row wrap v-else>
        Weergave
    </v-layout>
</template>

<script>
    export default {
        name: "EditChartComponent",
        data(){
            return {
                menuNumber: 0,
                options: [{"icon": "show_chart"}, {"icon": "bar_chart"}, {"icon": "pie_chart"}],
                buttons: ["Grafiektype", "Weergave"],
            }
        }
    }
</script>

<style scoped>

</style>
