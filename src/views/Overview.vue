<template>
    <div>

    <!--<DrawChart  :vragen="questions" :data="data" ></DrawChart>-->
        <div>
             <v-container grid-list-xs>
                <hr>
                <v-layout row wrap ref="printMe" style="background-color: #fafafa">
                    <v-flex xs12  md6 :lg8="chart.bigDiv" :lg4="!chart.bigDiv" pa-3  v-for="(chart,i) in pieArray.charts" :key="i">
                        <v-expansion-panel
                                v-model="panel[i]"
                                expand
                                style="border: 1px solid rgb(221, 221, 221)"
                        >
                            <v-expansion-panel-content>
                                <template v-slot:header>
                                    <div class="text-truncate" >Q{{i + 1}}. {{questions[i].questionTitle}}</div>
                                </template>
                                <div class="cardContent" v-if="chart.zerovalues === false">
                                    <v-btn small rounded depressed class="text-none" @click="chart.menuShow =! chart.menuShow" color="#475A64"  dark>Aanpassen</v-btn>

                                    <div>
                                    <span v-for="(button,index) in buttons" v-show="chart.menuShow">

                                                <v-btn @click="chart.menuNumber = index" flat depressed>{{button}}</v-btn>
                                            </span>
                                    <div class="uitschuifDiv">
                                        <v-expand-transition>
                                            <div v-show="chart.menuShow">
                                                    <div v-if="chart.menuNumber === 0">
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
                                                    <v-btn @click="changeFormat(i)">Geen Cijfers</v-btn>
                                           
                                                </v-layout>
                                            </div>
                                        </v-expand-transition>
                                    </div>
                                    </div>
                                    <v-chart
                                            class="bigboy" autoresize
                                            :options="pieArray.charts[i]"></v-chart>
                                </div>
                                <div class="cardContent" v-else>
                                    <v-container justify-space-around>
                                    <h1 class="text-xs-center"> no data</h1>
                                    </v-container>
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
 import 'echarts/lib/chart/line'
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
                options: [{"icon": "show_chart"}, {"icon": "bar_chart"}, {"icon": "pie_chart"},{"icon": "donut_large"}],
                displayOptions: [{"Radiobuttons": [
                    {"text": "percentages", "value": true},
                    {"text":"cijfers", "value": false},
                    {"text":"geen", "value": false}
                    ]}
                    ],
                buttons: ["Grafiektype", "Weergave"],
                pieArray: {
                    charts: []
                },
                panel: [],
                qData: [],
                menuNumber: 0,
                reactiveData: this.questions

            }
        },watch :{
            displayOptions(){
              console.log('wowzers')
          }
        }, methods: {
            changeFormat(index){
                this.pieArray.charts[index].series[0].label.show = false
            },
            toLine(graph  , option){

                var graphConfig = this.graphToLine(graph);
                graphConfig.chartType = option;

                if(option === 0){
                    graphConfig.series[0].type = 'line';
                    graphConfig.yAxis.show = true;
                    this.pieArray.charts.splice(graph, 1, graphConfig )
                } else if(option === 1) {
                    graphConfig.yAxis.show = true;
                    graphConfig.xAxis.show = true;
                   graphConfig.series[0].type = 'bar';
                    this.pieArray.charts.splice(graph, 1, graphConfig )
                } else if (option === 2){
                    graphConfig.series[0].type = 'pie';
                    this.pieArray.charts.splice(graph, 1, graphConfig )
                }else if (option === 3){
                    graphConfig.series[0].type = 'pie';
                    graphConfig.series[0].radius = ['45%', '75%'];
                    this.pieArray.charts.splice(graph, 1, graphConfig )
                }
                this.pieArray.charts[graph].chartType = option
            },
            graphToLine(graphNumber){
                var graph = {
                    bigDiv: false,
                    menuShow: true,
                    zerovalues: false,
                    menuNumber: 0,
                    chartType: 3,
                    legend: {},
                    tooltip: {},
                    xAxis: {
                        show: false,
                        data: this.reactiveData[graphNumber].questionChoices
                    },
                    yAxis: {
                        show: false
                    },
                    series: [{

                        color: ["#ea6767", "#55b4df", "#f89d92", "#2e7291"],
                        data: this.reactiveData[graphNumber].questionAnswers,
                        itemStyle: {
                            borderColor: 'white',
                            borderWidth: 2.3,
                        },
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
                };
                return graph
            },
                drawCharts(){
                this.pieArray = {
                        charts: []
                };

                for (let key in this.reactiveData) {
                    var allowed = 0;
                    for( let optie in this.reactiveData[key].questionAnswers){
                      // const keyName =  Object.values(this.reactiveData[key].questionAnswers[optie][1]);
                      // console.log(keyName);
                     if(this.reactiveData[key].questionAnswers[optie].value != null) {
                         allowed++
                     }

                    }
                    if(allowed > 0) {
                        this.pieArray.charts.push({
                            bigDiv: false,
                            zerovalues: false,
                            menuShow: true,
                            menuNumber: 1,
                            chartType: 3,
                            legend: {},
                            tooltip: {},
                            xAxis: {
                                show: false,
                                data: this.reactiveData[key].questionChoices
                            },
                            yAxis: {show: false},
                            series: [{
                                type: 'pie',
                                radius: ['45%', '75%'],
                                color: ["#ea6767", "#55b4df", "#f89d92", "#2e7291"],
                                data: this.reactiveData[key].questionAnswers,
                                itemStyle: {
                                    borderColor: 'white',
                                    borderWidth: 2.3,
                                },
                                label: {
                                    show: true,
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
                    } else {
                        console.log('zero values fam');
                        this.pieArray.charts.push({zerovalues: true})
                    }
                }
            }
        },
        created() {
            this.drawCharts();
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
    .uitschuifDiv {
        transition: .5s;
        background-color: #EEEEEE;
        overflow: hidden;
    }

</style>
