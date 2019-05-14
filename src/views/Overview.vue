<template>
    <div>
          <div>

            <v-container fluid grid-list-xs>
                Weergave: <v-btn @click="dashboardview"> Dash</v-btn> <v-btn @click="listview"> List</v-btn>
                <v-layout ref="printMe" row style="background-color: white" wrap>
                    <v-flex :key="i" :lg12="chart.isList" :lg3="!chart.bigDiv" :lg6="chart.bigDiv" md6 pa-3 v-for="(chart,i) in pieArray.charts"
                            xs12>
                        <v-expansion-panel
                                expand

                                v-model="panel[i]"
                        >
                            <v-expansion-panel-content>
                                <template v-slot:header>
                                    <div class="text-truncate">
                                        Q{{i + 1}}. {{reactiveData[i].Title}}
                                    </div>
                                </template>
                                <div class="cardContent" v-if="chart.zerovalues === false">
                                        <v-container>
                                            Antwoorden: {{reactiveData[i].SumAnswers}}
                                        </v-container>
                                    <div>

                                    <span v-for="(button,index) in buttons">
                                                <v-btn @click="chart.menuNumber = index" depressed flat>
                                                    <span @click="chart.menuShow =! chart.menuShow "
                                                          style="color:red" v-if="chart.menuNumber === index">
                                                    {{button}}
                                                     <v-icon small>keyboard_arrow_down</v-icon></span>
                                                    <span v-else-if="chart.menuNumber !== index"> {{button}}
                                                        <v-icon small>keyboard_arrow_up</v-icon></span>
                                                </v-btn>
                                    </span>

                                        <div class="uitschuifDiv">
                                            <v-expand-transition>
                                                <div v-show="chart.menuShow">
                                                    <div v-if="chart.menuNumber === 0">
                                                        <v-layout row wrap>
                                                            <v-flex lg2 md4 v-for="(option, optionIndex) in options"
                                                                    xs3>
                                                                <v-tooltip bottom>
                                                                    <template v-slot:activator="{ on }">
                                                                        <v-btn @click="toLine(i, optionIndex)" fab flat
                                                                               v-on="on">
                                                                            <v-icon color="red"
                                                                                    v-if="chart.chartType === optionIndex">{{option.icon}}
                                                                            </v-icon>
                                                                            <v-icon color="#707171" v-else>
                                                                                {{option.icon}}
                                                                            </v-icon>
                                                                        </v-btn>
                                                                    </template>
                                                                    <span>{{option.text}}</span>
                                                                </v-tooltip>
                                                            </v-flex>
                                                        </v-layout>

                                                        <v-btn @click="chart.menuShow =! chart.menuShow" class="text-none" color="#475A64" dark
                                                               small>Ga Terug
                                                        </v-btn>
                                                    </div>
                                                    <div v-else>
                                                        <v-layout row wrap>

                                                            <v-radio-group @change="displayHandler(chart.radioGroup, i)"
                                                                           v-model="chart.radioGroup">
                                                                <v-radio :value="0" color="#455A64" label="Geen Cijfers"></v-radio>
                                                                <v-radio :value="1" color="#455A64"  label="Absolute Cijfers"></v-radio>
                                                                <v-radio :value="2" color="#455A64"  label="Percentage"
                                                                         v-if="chart.chartType > 2"></v-radio>
                                                            </v-radio-group>

                                                            <v-checkbox v-model="chart.mediumShow" color="#455A64" v-if="chart.chartType < 3" label="Gemiddelde" @change="AddMiddleLine(i)"></v-checkbox>
                                                        </v-layout>
                                                        <v-btn @click="chart.menuShow =! chart.menuShow" class="text-none" color="#475A64" dark
                                                               small>Ga Terug
                                                        </v-btn>
                                                    </div>
                                                </div>
                                            </v-expand-transition>
                                        </div>
                                    </div>
                                    <v-chart
                                            :options="pieArray.charts[i]" autoresize
                                            class="bigboy"></v-chart>
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
    import 'echarts/lib/component/markLine'



    export default {

        name: 'Overview',
        components: {

            'v-chart': ECharts,
        },

        data() {
            return {
                options: [{"icon": "show_chart", "text": "Lijngrafiek"}, {
                    "icon": "bar_chart",
                    "text": "Staafgrafiek"
                }, {"icon": "bar_chart", "text": "Horizontale staafgrafiek"}, {
                    "icon": "donut_large",
                    "text": "Donutgrafiek"
                }, {"icon": "pie_chart", "text": "Taartgrafiek"}],
                radioGroup: 1,
                displayOptions: [{
                    "Radiobuttons": [
                        {"text": "percentages", "value": true},
                        {"text": "cijfers", "value": false},
                        {"text": "geen", "value": false}
                    ]
                }
                ],
                buttons: ["Grafiektype", "Weergave"],
                pieArray: {
                    charts: []
                },
                panel: [],
                qData: [],
                menuNumber: 0,
                reactiveData: this.$store.state.configuredSurvey
            }
        },
        methods: {
            listview(){
              for(let key in this.pieArray.charts){
                  this.pieArray.charts[key].isList = true;
                 }
              },
                dashboardview(){
                    for(let key in this.pieArray.charts){
                        this.pieArray.charts[key].isList = false;
                    }
                },
            AddMiddleLine(index){


                if(this.pieArray.charts[index].mediumShow){
                    this.pieArray.charts[index].series[0].markLine.data = [{"type": "average"}]
                } else {
                    this.pieArray.charts[index].series[0].markLine.data = null
                }
            },
            displayHandler(nummer, index) {

                if (nummer === 0) {
                    this.pieArray.charts[index].series[0].label.show = false;
                } else if (nummer === 1) {
                    this.pieArray.charts[index].series[0].label.show = true;
                    this.pieArray.charts[index].series[0].label.formatter = '{c}'
                } else if (nummer === 2) {
                    this.pieArray.charts[index].series[0].label.show = true;
                    this.pieArray.charts[index].series[0].label.formatter = '{d}%'
                }
            },

            toLine(graph, option) {

                const grafiek = this.pieArray.charts[graph];
                this.AddMiddleLine(graph);
                //Reset Graph

                grafiek.chartType = option;
                grafiek.yAxis.show = true;
                grafiek.xAxis.show = true;
                grafiek.xAxis.type = 'category';
                grafiek.yAxis.type = 'value';

                if (grafiek.series[0].label.formatter === "{d}%" && option < 3) {
                    grafiek.series[0].label.show = false;
                } else if (grafiek.series[0].label.formatter === "{d}%" && option > 2) {
                    grafiek.series[0].label.show = true;
                }

                if (option === 0) {
                    grafiek.series[0].type = 'line';
                } else if (option === 1) {
                    console.log(grafiek.yAxis.data);
                    console.log(grafiek.xAxis.data);
                    grafiek.series[0].type = 'bar';
                    grafiek.series[0].itemStyle.borderWidth = 0;
                } else if (option === 2) {

                    grafiek.series[0].type = 'bar';
                   grafiek.xAxis.type = 'value';
                    grafiek.yAxis.type = 'category';
                    grafiek.series[0].itemStyle.borderWidth = 0;
                    grafiek.yAxis.data = grafiek.xAxis.data;
                    console.log(grafiek.yAxis.data)

                } else if (option === 3) {
                    grafiek.series[0].markLine.data = null;
                    grafiek.series[0].itemStyle.borderWidth = 2.3;
                    grafiek.series[0].type = 'pie';
                    grafiek.series[0].radius = ['45%', '75%'];
                    grafiek.yAxis.show = false;
                    grafiek.xAxis.show = false;
                } else if (option === 4) {
                    grafiek.series[0].markLine.data = null;
                    grafiek.series[0].itemStyle.borderWidth = 2.3;
                    grafiek.series[0].type = 'pie';
                    grafiek.series[0].radius = ['0%', '75%'];
                    grafiek.yAxis.show = false;
                    grafiek.xAxis.show = false;
                }
            },

            drawCharts() {
                for (let chart in this.pieArray.charts) {
                    this.pieArray.charts[chart].series[0].data = this.reactiveData[chart].questionAnswers;

                    let allowed = 0;
                    for(let optie in this.reactiveData[chart].questionAnswers){

                        if (this.reactiveData[chart].questionAnswers[optie].value !== null) {
                            allowed++;
                        }
                    }

                    if(allowed === 0){
                        this.pieArray.charts[chart].zerovalues = true;
                    } else{
                        this.pieArray.charts[chart].zerovalues = false
                    }
                }
            },
            initOverview(){
                this.pieArray = {
                    charts: []
                };
                console.log(this.reactiveData);
                for (let key in this.reactiveData) {
                    let allowed = 0;

                    for (let optie in this.reactiveData[key].questionAnswers) {

                        if(this.reactiveData[key].questionAnswers[optie].value != null) {

                            allowed++;
                            break;
                        }
                    }
                    if (allowed > 0) {
                        const chart ={
                            bigDiv: false,
                            isList: false,
                            zerovalues: false,
                            menuShow: true,
                            mediumShow: false,
                            menuNumber: 1,
                            radioGroup: 2,
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
                                    // show: true,
                                    formatter: '{d}%',
                                    position: 'inside'
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
                                markLine: {
                                    show: false,
                                    silent: true,
                                    symbolSize: 0,
                                    data: null
                                }
                            }]

                        };
                        if(this.reactiveData[key].Type > 0 ){
                            const grafiek = chart;
                            grafiek.chartType = 1;

                            grafiek.yAxis.show = true;
                            grafiek.xAxis.show = true;
                            grafiek.series[0].type = 'bar';
                            grafiek.series[0].itemStyle.borderWidth = 0;
                            if(this.reactiveData[key].Type > 1){
                                grafiek.bigDiv = true;
                            }
                        }
                        this.pieArray.charts.push(chart)
                    } else {
                        console.log('zero values fam');
                        this.pieArray.charts.push({zerovalues: true})
                    }
                }
                const tempPanel = [];
                for (let key in this.pieArray.charts) {
                    tempPanel.push(0)
                }
                this.panel = tempPanel;
            }
        },created() {


            this.initOverview();
            this.$store.watch(this.$store.getters.getData, configuredSurvey => {
                this.reactiveData = configuredSurvey;
                console.log(this.reactiveData);
                this.drawCharts();
            });
            this.$store.watch(this.$store.getters.getReset, reset => {
                    this.initOverview();
            })
        }
    }
</script>

<style scoped>
    .bigboy {
        width: 100%;
    }

    .uitschuifDiv {
        transition: .5s;
        background-color: #EEEEEE;
        overflow: hidden;
    }

</style>
