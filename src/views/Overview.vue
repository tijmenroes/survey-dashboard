<template>
    <div>
    <!--<DrawChart  :vragen="questions" :data="data" ></DrawChart>-->
        <div>


             <v-container grid-list-xs>
                <hr>
                <v-layout row wrap ref="printMe" style="background-color: white">
                    <v-flex xs12  md6 :lg8="chart.bigDiv" :lg4="!chart.bigDiv" pa-3  v-for="(chart,i) in pieArray.charts" :key="i">
                        <v-expansion-panel
                                v-model="panel[i]"
                                expand
                                style="border: 1px solid rgb(221, 221, 221)"
                        >
                            <v-expansion-panel-content>
                                <template v-slot:header>
                                    <div class="text-truncate" >
                                        Q{{i + 1}}. {{reactiveData[i].Title}}
                                    </div>
                                </template>
                                <div class="cardContent" v-if="chart.zerovalues === false">
                                    <!--<v-btn small rounded depressed class="text-none" @click="chart.menuShow =! chart.menuShow" color="#475A64"  dark v-if="!chart.menuShow">Aanpassen</v-btn>-->

                                    <div>
                                    <span v-for="(button,index) in buttons" >
                                                <v-btn @click="chart.menuNumber = index" flat depressed>
                                                    <span v-if="chart.menuNumber === index" @click="chart.menuShow =! chart.menuShow " style="color:red">
                                                    {{button}}
                                                     <v-icon small >keyboard_arrow_down</v-icon></span>
                                                    <span v-else-if="chart.menuNumber !== index"> {{button}}
                                                        <v-icon small >keyboard_arrow_up</v-icon></span>
                                                </v-btn>
                                    </span>

                                    <div class="uitschuifDiv">
                                        <v-expand-transition>
                                            <div v-show="chart.menuShow">
                                                    <div v-if="chart.menuNumber === 0">
                                                        <v-layout row wrap>
                                                        <v-flex v-for="(option, optionIndex) in options" xs3 md4 lg2 >
                                                            <v-tooltip bottom>
                                                                <template v-slot:activator="{ on }">
                                                            <v-btn fab flat v-on="on" @click="toLine(i, optionIndex)">
                                                                <v-icon  v-if="chart.chartType === optionIndex" color="red">{{option.icon}}</v-icon>
                                                                <v-icon v-else color="#707171">{{option.icon}}</v-icon>
                                                            </v-btn>
                                                                </template>
                                                                <span>{{option.text}}</span>
                                                            </v-tooltip>
                                                        </v-flex>
                                                        </v-layout>

                                                        <v-btn color="#475A64" small class="text-none" dark @click="chart.menuShow =! chart.menuShow">Ga Terug</v-btn>
                                                    </div>
                                                <div v-else>

                                                    <v-layout row wrap >
                                                        <v-radio-group v-model="chart.radioGroup" @change="displayHandler(chart.radioGroup, i)">
                                                            <v-radio  :value="0" label="Geen Cijfers"></v-radio>
                                                            <v-radio  :value="1"  label="Absolute Cijfers"></v-radio>
                                                            <v-radio v-if="chart.chartType > 2"  :value="2" label="Percentage"></v-radio>
                                                        </v-radio-group>

                                                    </v-layout>
                                                    <v-btn color="#475A64" small class="text-none" dark @click="chart.menuShow =! chart.menuShow">Ga Terug</v-btn>
                                                </div>

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

        name: 'Overview',
        components: {

            'v-chart': ECharts,
        },
        mounted(){
          this.$store.watch(this.$store.getters.getData, configured => {
              this.reactiveData = configured;
              this.drawCharts();
          })
        },
        data() {
            return  {
                options: [{"icon": "show_chart", "text": "Lijngrafiek"}, {"icon": "bar_chart","text": "Staafgrafiek"}, {"icon": "bar_chart", "text": "Horizontale staafgrafiek"},{"icon": "donut_large", "text": "Donutgrafiek"},{"icon": "pie_chart", "text": "Taartgrafiek"}],
                radioGroup: 1,
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
                reactiveData: this.$store.state.configured

            }
        },
        computed:{

        },watch :{
            configured(){
              console.log('wowzers')
          }
        }, methods: {
            displayHandler(nummer, index){
                if(nummer === 0) {
                    this.pieArray.charts[index].series[0].label.show = false;
                } else if(nummer === 1){
                    this.pieArray.charts[index].series[0].label.show = true;
                    this.pieArray.charts[index].series[0].label.formatter = '{c}'
                } else if (nummer === 2){
                    this.pieArray.charts[index].series[0].label.show = true;
                    this.pieArray.charts[index].series[0].label.formatter = '{d}%'
                }
            },

            toLine(graph  , option){

                const grafiek = this.pieArray.charts[graph];
                //Reset Graph

                grafiek.chartType = option;
                grafiek.yAxis.show = true;
                grafiek.xAxis.show = true;
                grafiek.xAxis.type = 'category';
                grafiek.yAxis.type = 'value';

                if(grafiek.series[0].label.formatter === "{d}%" && option < 3) {
                    grafiek.series[0].label.show = false;
                } else if(grafiek.series[0].label.formatter === "{d}%" && option > 2) {
                    grafiek.series[0].label.show = true;
                }

                if(option === 0){
                    grafiek.series[0].type = 'line';
                    grafiek.yAxis.show = true;

                } else if(option === 1) {
                    grafiek.yAxis.show = true;
                    grafiek.xAxis.show = true;
                    grafiek.series[0].type = 'bar';
                } else if (option === 2){
                    grafiek.yAxis.show = true;
                    grafiek.xAxis.show = true;
                    grafiek.series[0].type = 'bar';
                    grafiek.yAxis.type = 'category';
                    grafiek.xAxis.type = 'value';

                }else if (option === 3){
                    grafiek.series[0].type = 'pie';
                    grafiek.series[0].radius = ['45%', '75%'];
                    grafiek.yAxis.show = false;
                    grafiek.xAxis.show = false;
                }else if (option === 4){
                    grafiek.series[0].type = 'pie';
                    grafiek.series[0].radius = ['0%', '75%'];
                    grafiek.yAxis.show = false;
                    grafiek.xAxis.show = false;
                }
            },

                drawCharts(){
                for(let chart in this.pieArray.charts){
                    this.pieArray.charts[chart].series[0].data = this.reactiveData[chart].questionAnswers
                }
            },

        },
        created() {
           // this.drawCharts();
            this.pieArray = {
                charts: []
            };

            for (let key in this.reactiveData) {
                var allowed = 0;
                for( let optie in this.reactiveData[key].questionAnswers){

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
                                show: true,
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

                        }]
                    })
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
