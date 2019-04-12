<template>
    <div>

                     <v-container grid-list-xs>
                         {{data}}
                        <v-layout row wrap ref="printMe" style="background-color: #fafafa">
                            <v-flex xs12  sm6 :md8="chart.bigDiv" :md4="!chart.bigDiv"  pa-3  v-for="(chart,i) in pieArray.charts" :key="i">
                                <v-expansion-panel
                                        v-model="panel[i]"
                                        expand
                                        style="border: 1px solid rgb(221, 221, 221)"
                                >
                                    <v-expansion-panel-content>
                                        <template v-slot:header>
                                            <div class="text-truncate" >Q{{i + 1}}. {{vragen[i].questionTitle}}</div>
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
</template>

<script>

    import ECharts from 'vue-echarts'
    import 'echarts/lib/chart/bar'
    import 'echarts/lib/chart/pie'
    import 'echarts/lib/component/tooltip'
    import 'echarts/lib/component/toolbox'
    import 'echarts/lib/component/legend'
   // import ExportComponent from '../components/ExportComponent.vue'
    export default {
        props: ['vragen', 'data'],
        components: {
            'v-chart': ECharts,

        },
        data() {
            //  console.log(poeparray[8]);
            return {
                questions: [],
                btnItems: ['Arial', 'Calibri', 'Courier', 'Verdana'],

                lol: [ { "name": "Tevreden", "value": 23 }, { "name": "Ontevreden", "value": 2 }, { "name": "Weet ik niet", "value": 5 } ],
                qData:[],
                info: null,
                panel: [],
                pieArray: {
                    bigDiv: true,
                    charts: []
                },
            }
        },
        created() {

            const hoofdArray = [];
            for (let key in this.vragen) {
                const arraytje = [];
                for(let nummer in this.vragen[key].questionAnswers){

                    //  console.log(this.vragen[key].questionChoices[nummer]);
                    arraytje.push({"name": this.vragen[key].questionChoices[nummer], "value":this.vragen[key].questionAnswers[nummer] })

                }
                hoofdArray.push(arraytje);
                if (this.vragen[key].questionType === 1) {
                    this.pieArray.charts.push({
                        bigDiv: false,
                        legend: {},
                        tooltip: {},
                        xAxis: {
                            data: this.vragen[key].questionChoices

                        },
                        yAxis: {type: 'value'},
                        xAxes: {
                            options: {
                                stacked: true,
                            }
                        },
                        series: [{
                            type: 'bar',
                            color: "#3a84dd",
                            data: this.vragen[key].questionAnswers,

                            label: {
                                formatter: '{d}%',
                                position: 'inner'
                            },

                            smooth: true,
                            symbolSize: 6,
                            lineStyle: {
                                width: 3.5
                            },
                            areaStyle: {
                                opacity: 0.4
                            },
                            markLine: {
                                show: false,
                                silent: true,
                                symbolSize: 0,
                                lineStyle: {
                                    normal: {
                                        type: 'dashed'
                                    }
                                }, label: {
                                    fontSize: 9,
                                },
                                data: [
                                    {
                                        name: 'average line',
                                        type: 'average'
                                    },
                                ]
                            }
                        }]
                    })
                } else if (this.vragen[key].questionType === 3) {
                    this.pieArray.charts.push({
                        bigDiv: true,
                        legend: {},
                        tooltip: {},
                        xAxis: {
                            data: this.vragen[key].questionChoices
                        },
                        yAxis: {},
                        series: [{

                            type: 'bar',
                            color: "#3a84dd",
                            data: this.vragen[key].questionAnswers
                        }]
                    })
                } else if (this.vragen[key].questionType === 2) {
                    this.pieArray.charts.push({
                        bigDiv: false,
                        legend: {},
                        tooltip: {},
                        xAxis: {
                            show: false,
                            data: this.vragen[key].questionChoices
                        },
                        yAxis: {show: false},
                        series: [{
                            type: 'pie',

                            color: ["#3ac5d8", "#4639de", "#3a84dd", "#8242fa"],
                            data: this.vragen[key].questionAnswers,
                            // data: this.lol,
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
            console.log(hoofdArray);
            this.qData = hoofdArray;

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
    .menu {
        position: fixed;
    }
</style>
