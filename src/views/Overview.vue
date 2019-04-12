<template>
    <div>

    <!--<DrawChart  :vragen="questions" :data="data" ></DrawChart>-->
        <div>

            <v-container grid-list-xs>

                <hr>
                {{pieArray.charts[0].series[0].data}}
                <hr>
                <v-layout row wrap ref="printMe" style="background-color: #fafafa">
                    <v-flex xs12  sm6 :md8="chart.bigDiv" :md4="!chart.bigDiv"  pa-3  v-for="(chart,i) in pieArray.charts" :key="i">
                        <v-expansion-panel
                                v-model="panel[i]"
                                expand
                                style="border: 1px solid rgb(221, 221, 221)"
                        >
                            <v-expansion-panel-content>
                                <template v-slot:header>
                                    <div class="text-truncate" >Q{{i + 1}}. {{questions[i].questionTitle}}</div>
                                </template>
                                <div style="height:400px">
                                    <v-chart
                                            class="bigboy" autoresize
                                            :options="pieArray.charts[i]"></v-chart>
                                </div>
                            </v-expansion-panel-content>
                        </v-expansion-panel>
                    </v-flex>
                </v-layout>
            </v-container>
        </div>

    </div>
</template>

<script>

 import ECharts from 'vue-echarts'
 import 'echarts/lib/chart/bar'
 import 'echarts/lib/chart/pie'
 import 'echarts/lib/component/tooltip'
 import 'echarts/lib/component/toolbox'
 import 'echarts/lib/component/legend'


    export default {
        props:['questions'],
        name: 'Overview',
        components: {
          //  DrawChart
            'v-chart': ECharts,
        },

        data() {
            return  {
                pieArray: {

                    charts: []
                },
                panel: [],
                qData: [],
                reactiveData: this.questions

            }
        }, methods: {
            drawCharts(){
                this.pieArray = {
                        charts: []
                };

                for (let key in this.reactiveData) {

                    this.pieArray.charts.push({
                        bigDiv: false,
                        legend: {},
                        tooltip: {},
                        xAxis: {
                            show: false,
                            data: this.reactiveData[key].questionChoices
                        },
                        yAxis: {show: false},
                        series: [{
                            type: 'pie',

                            color: ["#3ac5d8", "#4639de", "#3a84dd", "#8242fa"],
                            data: this.reactiveData[key].questionAnswers,
                            label: {
                                formatter: '{d}%',
                                position: 'inner'
                            },
                            // color: "#3a84dd",
                            smooth: true,
                            symbolSize: 6,
                            lineStyle: {
                                width: 3.5
                            },
                            areaStyle: {
                                opacity: 0.4
                            },

                        }]
                    })

                }
            }
        },
        created() {
            this.drawCharts();
            // console.log(hoofdArray);
            // this.qData = hoofdArray;

            const tempPanel = [];
            for (let key in this.pieArray.charts) {
                tempPanel.push(0)
            }
            this.panel = tempPanel;


        }
    }
</script>

<style scoped>
    .bigboy {
        width:100%;
    }
</style>
