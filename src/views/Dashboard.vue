<template>
    <div>
          <div>
              <MenuComponent
                             @toDash="changeRow(-1)"
                             @one-per-row="changeRow(0)"
                             @two-per-row="changeRow(1)"
                             @three-per-row="changeRow(2)"
                             @printDashboard="testExport(-1)"></MenuComponent>
              <FilterBox></FilterBox>
            <v-container fluid grid-list-xs style="padding: 0 !important">
                <v-layout ref="toPrint" row style="background-color: white" wrap v-bind="checkViewWidth">
                    <v-flex :key="i" xs12
                            :lg12="chart.oneperRow"  :md12="chart.oneperRow" :sm12="chart.oneperRow"
                            :lg6="chart.twoperRow"  :md6="chart.twoperRow"
                            :lg4="chart.threeperRow"  :sm4="chart.threeperRow"
                            lg3 sm6 md4
                            :pl-3="!phoneDetected" :pr-3="!phoneDetected" pb-4 v-for="(chart,i) in chartArray.charts"
                            :ref="i"  >
                        <div >
                            <!--:lg12="chart.isList" lg3 sm6 md4-->
                        <v-expansion-panel
                                expand
                                v-model="panel[i]"
                        >
                            <v-expansion-panel-content :style="exportStyle"  >
                                <template v-slot:header>
                                    <div class="text-truncate">
                                        {{i + 1}}. {{reactiveData[i].Title}}
                                    </div>
                                </template>
                                <div class="cardContent" v-if="chart.zerovalues === false">
                                    <div v-if="chart.chartType !==  5">

                                        <v-container v-if="chart.menuShow === false">
                                            Antwoorden: {{reactiveData[i].SumAnswers}}
                                            <div style="float: right">
                                                <div class="chartbutton" @click="testExport(i)" >
                                                    Exporteren
                                                </div>
                                                <div class="chartbutton" @click="chart.menuShow = true">
                                                    Aanpassen
                                                </div>
                                            </div>
                                        </v-container>
                                    <div>


                                        <div>
                                            <v-expand-transition>
                                                <div v-show="chart.menuShow" class="editContainer">
                                                    <ul class="tabList">
                                                        <li v-for="(button,index) in buttons" @click="chart.menuNumber = index" class="optionsTabs ">
                                                             <span class="tabActive normaltab" v-if="chart.menuNumber === index">
                                                    {{button}}
                                                    </span>
                                                    <span class="normaltab" v-else-if="chart.menuNumber !== index"> {{button}}
                                                    </span>
                                                        </li>
                                                    </ul>
                                                    <span v-for="(button,index) in buttons" @click="chart.menuNumber = index" class="optionsTabs ">

                                                    </span>

                                                    <div class="uitschuifDiv">
                                                        <v-layout row wrap v-if="chart.menuNumber === 0">
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


                                                    <div v-else >
                                                        <v-layout row wrap class="optionContent" >
                                                            <v-flex xs6>
                                                                Labels
                                                                <v-radio-group @change="displayHandler(chart.radioGroup, i)"
                                                                               v-model="chart.radioGroup" style="margin-top: 0 !important;">
                                                                    <v-radio small :value="0" color="#455A64" label="Geen Cijfers"></v-radio>
                                                                    <v-radio :value="1" color="#455A64"  label="Absolute Cijfers"></v-radio>
                                                                    <v-radio :value="2" color="#455A64"  label="Percentages"
                                                                             v-if="chart.chartType > 2"></v-radio>
                                                                    <v-radio :value="2" color="#455A64"  label="Percentages"
                                                                             v-else disabled></v-radio>
                                                                </v-radio-group>
                                                            </v-flex>

                                                                <v-flex xs6>
                                                                    Weergeven
                                                                    <v-checkbox style="margin-top: 0 !important;"
                                                                            v-model="chart.mediumShow" color="#455A64" v-if="chart.chartType < 3" label="Gemiddelde" @change="AddMiddleLine(i)"></v-checkbox>
                                                                    <v-checkbox style="margin-top: 0 !important;"
                                                                                v-model="chart.mediumShow" color="#455A64" v-else label="Gemiddelde" disabled></v-checkbox>
                                                                </v-flex>


                                                        </v-layout>
                                                    </div>
                                                        <div class="backButtonContainer">
                                                            <div class="chartbutton backbutton" @click="chart.menuShow =! chart.menuShow">
                                                                Sluit
                                                            </div>
                                                        </div>

                                                </div>
                                                </div>
                                            </v-expand-transition>
                                        </div>
                                    </div>
                                    <v-chart
                                            :options="chartArray.charts[i]" autoresize
                                            class="bigboy"
                                            ></v-chart>
                                    </div>
                                    <div v-else>
                                        <v-container v-if="chart.menuShow === false">
                                            Antwoorden: {{reactiveData[i].SumAnswers}}

                                        </v-container>
                                           <ul class="textCard">
                                               <li v-for="data in chart.answers">
                                                   {{data}}
                                               </li>
                                           </ul>

                                    </div>
                                </div>
                                <div class="cardContent" v-else>
                                    <v-container justify-space-around>
                                        <h1 class="text-xs-center"> no data</h1>
                                    </v-container>
                                </div>
                            </v-expansion-panel-content>
                        </v-expansion-panel>
                        </div>
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
    import FilterBox from '../components/dbFilterBox.vue'
    import MenuComponent from '../components/dbMenu.vue'

    export default {
        name: 'Overview',
        components: {
            FilterBox,
            MenuComponent,
            'v-chart': ECharts,
        },
        data() {
            return {
                phoneDetected: false,
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
                chartArray: {
                    charts: []
                },
                panel: [],
                qData: [],
                exportStyle: "border: none" ,
                menuNumber: 0,
                reactiveData: this.$store.state.configuredSurvey
            }
        },
        methods: {
            testExport(number){
                const vm = this;
                this.exportStyle =  "border: 0.1rem solid rgba(0,0,0,0.23) !important;";
                setTimeout(function(){
                    vm.exportAsImg(number);
                    vm.exportStyle =  "border: none";
                }, 1);

            }, exportAsImg(number){
                const options = {
                    type: 'dataURL',
                    backgroundColor: null,
                };
                if(number !== -1){
                    this.$html2canvas(this.$refs[number][0], options).then(function (canvas) {
                        saveAs(canvas, 'Overview_ProductSurvey' + '.png');
                    });

                } else {
                    this.$html2canvas(this.$refs.toPrint, options).then(function (canvas) {
                        saveAs(canvas, 'Overview_ProductSurvey' + '.png');
                    });
                }
                function saveAs(uri, filename) {
                    var link = document.createElement('a');
                    if (typeof link.download === 'string') {
                        link.href = uri;
                        link.download = filename;
                        //Firefox requires the link to be in the body
                        document.body.appendChild(link);
                        //simulate click
                        link.click();
                        //remove the link when done
                        document.body.removeChild(link);
                    } else {
                        window.open(uri);
                    }
                }
            },
             changeRow(key){
                let array = [false, false, false];
                if(key > -1) {
                    array[key] = true;
                }
                for(let key in this.chartArray.charts){
                    this.chartArray.charts[key].oneperRow = array[0];
                    this.chartArray.charts[key].twoperRow = array[1];
                    this.chartArray.charts[key].threeperRow = array[2];
                }
            },
            AddMiddleLine(index){
                if(this.chartArray.charts[index].mediumShow){
                    this.chartArray.charts[index].series[0].markLine.data = [{"type": "average"}]
                } else {
                    this.chartArray.charts[index].series[0].markLine.data = null
                }
            },
            displayHandler(nummer, index) {
                if (nummer === 0) {
                    this.chartArray.charts[index].series[0].label.show = false;
                } else if (nummer === 1) {
                    this.chartArray.charts[index].series[0].label.show = true;
                    this.chartArray.charts[index].series[0].label.formatter = '{c}'
                } else if (nummer === 2) {
                    this.chartArray.charts[index].series[0].label.show = true;
                    this.chartArray.charts[index].series[0].label.formatter = '{d}%'
                }
            },

            toLine(graph, option) {

                const grafiek = this.chartArray.charts[graph];

                this.AddMiddleLine(graph);
                //Reset Graph
                grafiek.chartType = option;
                grafiek.yAxis.show = true;
                grafiek.xAxis.show = true;
                grafiek.xAxis.type = 'category';
                grafiek.yAxis.type = 'value';
                grafiek.series[0].type = 'line';

                if (grafiek.series[0].label.formatter === "{d}%" && option < 3) {
                    grafiek.radioGroup = 0;
                    grafiek.series[0].label.show = false;
                }
                if (option === 0) {

                    console.log('wauw');
                    // grafiek.series[0].type = 'line';
                    //  grafiek.series[0].type = 'line';
                    //  grafiek.series[0].type = 'bar';
                    //  grafiek.series[0].itemStyle.borderWidth = 0;

                }
              else if (option === 1) {

                    grafiek.series[0].type = 'bar';
                    grafiek.series[0].itemStyle.borderWidth = 0;

                } else if (option === 2) {

                    grafiek.series[0].type = 'bar';
                   grafiek.xAxis.type = 'value';
                    grafiek.yAxis.type = 'category';
                    grafiek.series[0].itemStyle.borderWidth = 0;
                    grafiek.yAxis.data = grafiek.xAxis.data;


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
                for (let chart in this.chartArray.charts) {
                    if (this.chartArray.charts[chart].chartType > 0) {
                        this.chartArray.charts[chart].series[0].data = this.reactiveData[chart].questionAnswers;
                        let allowed = 0;
                        for (let optie in this.reactiveData[chart].questionAnswers) {
                            if (this.reactiveData[chart].questionAnswers[optie].value !== null) {
                                allowed++;
                            }
                        }
                        if (allowed === 0) {
                            this.chartArray.charts[chart].zerovalues = true;
                        } else {
                            this.chartArray.charts[chart].zerovalues = false
                        }
                    }else {
                         //Wanneer het een tekstvak is
                        const answerArray = [];
                        for(let answer in this.reactiveData[chart].questionAnswers){
                            if (this.reactiveData[chart].questionAnswers[answer] != null) {
                                answerArray.push(this.reactiveData[chart].questionAnswers[answer]);
                            }
                           this.chartArray.charts[chart].answers = answerArray;
                        }
                    }
                }
            },
            initOverview(){
                this.chartArray = {
                    charts: []
                };
                for (let key in this.reactiveData) {
                    if(this.reactiveData[key].Type === 5){
                        let answerArray = [];
                        for(let answer in this.reactiveData[key].questionAnswers){
                            if (this.reactiveData[key].questionAnswers[answer] != null) {
                                answerArray.push(this.reactiveData[key].questionAnswers[answer]);
                            }
                        }
                        const chart = {
                            oneperRow: false,
                            twoperRow: false,
                            threeperRow: false,
                            zerovalues: false,
                            menuShow: false,
                            mediumShow: false,
                            menuNumber: 1,
                            radioGroup: 2,
                            chartType: 5,
                            answers: answerArray
                        };
                        this.chartArray.charts.push(chart)
                    }
                    else {
                        let allowed = 0;
                        for (let optie in this.reactiveData[key].questionAnswers) {
                            if (this.reactiveData[key].questionAnswers[optie].value != null) {
                                allowed++;
                                break;
                            }
                        }
                        if (allowed > 0) {
                            const chart = {
                                bigDiv: false,
                                isList: false,
                                zerovalues: false,
                                menuShow: false,
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
                                    // color: ["#ea6767", "#55b4df", "#f89d92", "#2e7291"],
                                    color:["#f64a48", "#58c0eb","#475a64", "#33658A"],
                                    //F8C7CC
                                    //FF8360
                                    data: this.reactiveData[key].questionAnswers,
                                    itemStyle: {
                                        borderColor: 'white',
                                        borderWidth: 2.3,
                                    },
                                    label: {
                                        formatter: '{d}%',
                                        position: 'inside'
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
                                        data: null
                                    }
                                }]

                            };
                            if (this.reactiveData[key].Type > 0) {
                                const grafiek = chart;
                                grafiek.chartType = 1;
                                grafiek.radioGroup = 0;
                                grafiek.yAxis.show = true;
                                grafiek.xAxis.show = true;
                                grafiek.series[0].type = 'bar';
                                grafiek.series[0].itemStyle.borderWidth = 0;

                            }
                            this.chartArray.charts.push(chart)
                        } else {
                            this.chartArray.charts.push({zerovalues: true})
                        }
                    }
                }
                const tempPanel = [];
                for (let key in this.chartArray.charts) {
                    tempPanel.push(0)
                }
                this.panel = tempPanel;
            }
        },created() {

            this.initOverview();
            this.$store.watch(this.$store.getters.getData, configuredSurvey => {
                this.reactiveData = configuredSurvey;

                this.drawCharts();
            });
            this.$store.watch(this.$store.getters.getReset, reset => {
                console.log('resetted');
                this.initOverview();
            })
        }, computed :{
            checkViewWidth(){

                if (this.$vuetify.breakpoint.xsOnly){
                    this.phoneDetected = true;
                }  else {
                    this.phoneDetected = false;
                }
            }
        }
    }
</script>

<style scoped>
    .tabList{
        display:inline-block;
        float: right;
        padding-left: 0;
        padding-right: 20px;
    }
    .optionContent {
        padding-left: 20px;
        font-size: 15px;
        padding-top: 20px;
    }
    .editContainer {
        padding-top: 24px;
    }
    .optionsTabs{
        position: relative;
        display:inline-block;
        top: -8px;
        font-weight:500;
        color: #7E8B92;
        padding-left: 4px;
    }
    .normaltab {
        padding: 11px;
        font-size: 13px;
        transition: .4s;
        cursor: pointer;
        border: 1px solid transparent;
        border-bottom: none;
        border-radius: 4px 4px 0 0;
    }
    .normaltab:hover {
        border-color: #dbdbdb;
        background:#EEEEEE;
        color: #475963;
    }
    .tabActive {
        color: #475963;
        background:#EEEEEE;
        border: 1px solid #dbdbdb;
        border-bottom: none;
     }
    .chartbutton {
        transition: .2s;
        cursor: pointer;
        background: #455a64;
        padding: 5px 15px;
        color: white;
        font-size: 11px;
        border-radius: 10px;
        margin-left: 10px;
        font-weight: 500;
        float: right;
        letter-spacing: 0.015rem;
        margin-top: 0px;
    }
    .backbutton {
        float: left;
    }
    .backButtonContainer {
        padding-left: 20px;
    }
    .chartbutton:hover{
        background: #37474f;
    }
    .textCard{
        max-height: 400px;
        overflow: auto;
        line-height: 35px;
        padding: 0px;
    }
    .textCard li {
        padding: 10px;
        list-style:none;
    }
   .textCard li:nth-child( odd ) {
        background: #fafafa;
    }
    .bigboy {
        width: 100%;
    }
    .uitschuifDiv {
        border-top: 1px solid #dbdbdb;
        border-bottom: 1px solid #dbdbdb;
        background-color: #EEEEEE;
        overflow: hidden;
        padding-bottom: 10px;
    }

</style>
