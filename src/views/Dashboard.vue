<template>
    <div>

              <div>
              <div :style="$store.state.menuPadding">
              <MenuComponent @printDashboard="exportDashboard(-1)"></MenuComponent>
              <FilterBox></FilterBox>
              </div>
            <v-container fluid grid-list-xs style="padding: 0 !important">
                <v-layout ref="toPrint" row style="background-color: white" wrap>
                    <v-flex :key="i" xs12
                            :lg12="oneperRow"  :md12="oneperRow" :sm12="oneperRow"
                            :lg6="twoperRow"  :md6="twoperRow"
                            :lg4="threeperRow"  :sm4="threeperRow"
                            lg3 sm6 md4
                            :pl-3="!$store.state.phoneDetected" :pr-3="!$store.state.phoneDetected" pb-4 v-for="(chart,i) in chartArray.charts"
                            :ref="i" >
                        <div>
                        <v-expansion-panel
                                expand
                                v-model="panel[i]"
                        >
                            <v-expansion-panel-content :style="exportStyle">
                                <template v-slot:header>
                                    <div>
                                     <p class="cardTitel">  {{i + 1}}. {{reactiveData[i].Title}} </p>
                                    </div>
                                </template>
                                <div class="cardContent" v-if="chart.zerovalues === false">
                                    <div v-if="chart.chartType !==  5">

                                        <v-container v-if="chart.menuShow === false">
                                            Antwoorden: {{reactiveData[i].SumAnswers}}
                                            <div style="float: right">
                                                <div class="chartbutton" @click="exportDashboard(i)" >
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
                                                        <li v-for="(button,index) in buttons" :key="index" @click="chart.menuNumber = index" class="optionsTabs ">
                                                             <span class="tabActive normaltab" v-if="chart.menuNumber === index">
                                                    {{button}}
                                                    </span>
                                                    <span class="normaltab" v-else-if="chart.menuNumber !== index"> {{button}}
                                                    </span>
                                                        </li>
                                                    </ul>
                                                    <span v-for="(button,index) in buttons" :key="index" @click="chart.menuNumber = index" class="optionsTabs ">
                                                    </span>
                                                    <div class="uitschuifDiv">
                                                        <v-layout row wrap v-if="chart.menuNumber === 0" class="optionContent">
                                                            <v-flex v-for="(option, optionIndex) in options" :key="optionIndex" shrink  class="graphButtonContainer">
                                                                <v-tooltip bottom>
                                                                    <template v-slot:activator="{ on }">
                                                                        <div @click="changeGraph(i, optionIndex)" class="graphButton graphButtonActive"  v-if="chart.chartType === optionIndex"
                                                                               v-on="on">
                                                                            <v-icon color="white" :style="{transform: option.extraCSS}"
                                                                                   >{{option.icon}}
                                                                            </v-icon>
                                                                        </div>
                                                                        <div v-else @click="changeGraph(i, optionIndex)" class="graphButton" v-on="on">
                                                                            <v-icon color="#707171" :style="{transform: option.extraCSS}">
                                                                                {{option.icon}}
                                                                            </v-icon>
                                                                        </div>
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
                                                                    <v-radio :value="0" color="#455A64" label="Geen Cijfers"></v-radio>
                                                                    <v-radio :value="1" color="#455A64"  label="Absolute Cijfers"></v-radio>
                                                                    <v-radio :value="2" color="#455A64"  label="Percentages"
                                                                             v-if="chart.chartType > 2"></v-radio>
                                                                    <v-radio :value="2" color="#455A64"  label="Percentages"
                                                                             v-else disabled></v-radio>
                                                                </v-radio-group>
                                                            </v-flex>
                                                                <v-flex xs6 >
                                                                    Weergeven
                                                                    <v-checkbox style="margin-top: 0 !important;"
                                                                            v-model="chart.mediumShow" color="#455A64" v-if="chart.chartType < 3"
                                                                                hide-details label="Gemiddelde" @change="AddMiddleLine(i)"></v-checkbox>
                                                                            <v-checkbox style="margin-top: 0 !important;"
                                                                                        v-model="chart.mediumShow" color="#455A64"  label="Gemiddelde"  v-else hide-details disabled></v-checkbox>
                                                                    <v-checkbox style="margin-top: 0 !important;"
                                                                                v-model="chart.tableShow" color="#455A64" label="Tabel" ></v-checkbox>
                                                                </v-flex>
                                                        </v-layout>
                                                    </div>
                                                        <div class="backButtonContainer">
                                                            <div class="chartbutton backbutton" @click="chart.menuShow =! chart.menuShow">
                                                                Sluiten
                                                            </div>
                                                        </div>
                                                </div>
                                                </div>
                                            </v-expand-transition>
                                        </div>
                                    </div>
                                    <v-chart
                                            :options="chartArray.charts[i]" autoresize
                                            class="chartContainer"
                                            ></v-chart>
                                        <div v-if="chart.tableShow">
                                            <table>
                                                <thead></thead>
                                            </table>
                                            <v-data-table
                                                    :headers="headers"
                                                    :items="chart.series[0].data"
                                                    rows-per-page-text="items per pagina"
                                                    :rows-per-page-items="amountOfRowsDataTable"
                                                    hide-actions
                                                    item-key="name"
                                            >
                                                <template v-slot:items="props">
                                                    <tr @click="props.expanded = !props.expanded">
                                                        <td >{{ props.item.name }}</td>
                                                        <td v-if="props.item.value !== null ">{{ props.item.value }}</td>
                                                        <td v-else>0</td>
                                                    </tr>
                                                </template>
                                            </v-data-table>
                                        </div>
                                    </div>
                                    <div v-else>
                                        <v-container v-if="chart.menuShow === false">
                                            Antwoorden: {{reactiveData[i].SumAnswers}}

                                        </v-container>
                                           <ul class="textCard">
                                               <li v-for="(data, index) in chart.answers" :key="index">
                                                   {{data}}
                                               </li>
                                           </ul>
                                    </div>
                                </div>
                                <div class="cardContent" v-else>
                                    <v-container justify-space-around>
                                        <h2 class="text-xs-center"> Geen antwoorden</h2>
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

                options: [{"icon": "show_chart", "text": "Lijngrafiek", "extraCSS": "0"}, {
                    "icon": "bar_chart",
                    "text": "Staafgrafiek",
                    "extraCSS": "0"
                }, {"icon": "bar_chart", "text": "Horizontale staafgrafiek", "extraCSS": "rotate(90deg) !important"}, {
                    "icon": "donut_large",
                    "text": "Donutgrafiek","extraCSS": "0"
                }, {"icon": "pie_chart", "text": "Taartgrafiek","extraCSS": "0"}],
                buttons: ["Grafiektype", "Weergave"],
                chartArray: {
                    charts: []
                },
                headers: [{text: "Keuze", value: "name", sortable: false},{text: "Aantal", value: "amount", sortable: false}],
                amountOfRowsDataTable: [{"text":"$vuetify.dataIterator.rowsPerPageAll","value":-1}],
            panel: [],
                exportStyle: "border: none" ,
                reactiveData: this.$store.state.configuredSurvey,
                oneperRow: false,
                twoperRow: false,
                threeperRow: false,
            }
        },
        methods: {
            exportDashboard(number){
                //Functie zet een border om de vakken en voert exportfunctie uit, daarna is border weer weg.
                const vm = this;
                this.exportStyle =  "border: 0.1rem solid rgba(0,0,0,0.23) !important;";
                setTimeout(function(){
                    vm.exportAsImg(number);
                    vm.exportStyle =  "border: none";
                }, 1);

            }, exportAsImg(number){
                //Afbeelding wordt geëxporteerd als afbeelding, wanneer -1 wordt meegegeven, wordt het hele dashboard geëxporteerd.
                const options = {
                    type: 'dataURL',
                    backgroundColor: '#fff',
                };
                const name = this.$store.state.surveyName;
                if(number !== -1){
                    this.$html2canvas(this.$refs[number][0], options).then(function (canvas) {
                        saveAs(canvas, name + '.jpeg');
                    });

                } else {
                    this.$html2canvas(this.$refs.toPrint, options).then(function (canvas) {
                        saveAs(canvas, name + '.jpeg');
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
                //Verandert hoeveel vakken per rij er zijn.
                let array = [false, false, false];
                if(key > -1) {
                    array[key] = true;
                }
                    this.oneperRow = array[0];
                    this.twoperRow = array[1];
                    this.threeperRow = array[2];
            },
            AddMiddleLine(index){
                //Voegt een gemiddelde lijn aan de grafiek als dat kan
                if(this.chartArray.charts[index].mediumShow){
                    this.chartArray.charts[index].series[0].markLine.data = [{"type": "average"}]
                } else {
                    this.chartArray.charts[index].series[0].markLine.data = null
                }
            },
            displayHandler(nummer, index) {
                //Voert de keuzes van 'Weergave' uit.
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
            changeGraph(graph, option) {
                //Veranderen van grafiek opties.
                //zie: eCharts documentation
                const grafiek = this.chartArray.charts[graph];
                this.AddMiddleLine(graph);
                //Reset Graph
                grafiek.chartType = option;
                grafiek.yAxis.show = true;
                grafiek.xAxis.show = true;
                grafiek.xAxis.type = 'category';
                grafiek.yAxis.type = 'value';
                grafiek.series[0].type = 'line';
                grafiek.series[0].itemStyle.borderWidth = 0;
                grafiek.series[0].itemStyle.borderColor = 'white';

                if (grafiek.series[0].label.formatter === "{d}%" && option < 3) {
                    grafiek.radioGroup = 0;
                    grafiek.series[0].label.show = false;
                }
                if(option === 0){
                    grafiek.series[0].itemStyle.borderWidth = 1;
                    grafiek.series[0].itemStyle.borderColor = '#f64a48';
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

            updateData() {
                //Data wordt geüpdate wanneer dat nodig is, zit vast aan een watcher.
                for (let chart in this.chartArray.charts) {
                    let allowed = 0;
                    if (this.chartArray.charts[chart].chartType < 5) {
                        this.chartArray.charts[chart].series[0].data = this.reactiveData[chart].questionAnswers;

                        for (let optie in this.reactiveData[chart].questionAnswers) {
                            if (this.reactiveData[chart].questionAnswers[optie].value !== null) {
                                allowed++;
                            }
                        }
                    }else {
                         //Wanneer het een tekstvak is
                        const answerArray = [];
                        for(let answer in this.reactiveData[chart].questionAnswers){
                            if (this.reactiveData[chart].questionAnswers[answer] != null) {
                                answerArray.push(this.reactiveData[chart].questionAnswers[answer]);
                                allowed++;
                            }
                           this.chartArray.charts[chart].answers = answerArray;
                        }
                    }
                    if (allowed === 0) {
                        this.chartArray.charts[chart].zerovalues = true;
                    } else {
                        this.chartArray.charts[chart].zerovalues = false;
                    }
                }

            },
            initDashboard(){
                //Bij het opstarten, hier wordt alle data in een juiste array gezet. Zodat de vakken gedisplayd kunnen worden.
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
                            zerovalues: false, //Wanneer er geen data in zit
                            menuShow: false, //Of het editmenu geshowed moet worden
                            menuNumber: 0, //Waar de gebruiker is op het menu
                            radioGroup: 2, //Welke optie is ingesteld bij weergave radiobuttons
                            chartType: 5, //Wat voor type de vraag is, 5 beteketne vraag
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
                                oneperRow: false,
                                twoperRow: false,
                                threeperRow: false,
                                zerovalues: false,
                                menuShow: false,
                                mediumShow: false,
                                tableShow: false,
                                menuNumber: 0,
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
                                    color:["#f64a48", "#58c0eb","#475a64", "#33658A", "#FF8360"],
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
        },
        created() {

            this.initDashboard();
            this.$store.watch(this.$store.getters.getData, configuredSurvey => {
                //Update data wanneer watcher een verandering oppakt.

                this.reactiveData = configuredSurvey;
                this.updateData();
            });
            this.$store.watch(this.$store.getters.getReset, reset => {
                //Reset dashboard wanneer watcher een verandering oppakt.
                this.oneperRow = false;
                this.twoperRow = false;
                this.threeperRow = false;
                this.$store.state.weergaveStatus = "Automatisch";
                this.initDashboard();
            });
            this.$store.watch(this.$store.getters.getWeergave, weergaveStatus => {
                //Watcher die zorgt dat de juiste weergave wordt uitgevoerd.
                const status = weergaveStatus;

                if (status === 'Automatisch') {
                    this.changeRow(-1)
                } else if (status === '1 per rij') {
                    this.changeRow(0)
                } else if (status === '2 per rij') {
                    this.changeRow(1)
                } else if (status === '3 per rij') {
                    this.changeRow(2)
                }
            });
        },
    }
</script>

<style scoped>
    .theme--light.v-messages{
     min-height: 0 !important;
    }
    .cardTitel {
        font-size: 13px;
        font-weight: bold;
    }
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
        margin-right: 10px;
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
    .chartContainer {
        width: 100%;
    }
    .uitschuifDiv {
        border-top: 1px solid #dbdbdb;
        border-bottom: 1px solid #dbdbdb;
        background-color: #EEEEEE;
        overflow: hidden;
        padding-bottom: 10px;
    }
    .graphButtonContainer{
        margin-bottom: 10px;
    }
    .graphButton {
        padding: 11px;
        border:  0.1rem solid rgba(0,0,0,0.23);
        display:inline-block;
        border-radius: 5px;
        margin-right: 14px;
        transition: .2s;
        cursor: pointer;
    }
    .graphButton:hover{
        background: rgba(255,77,77, 1);
        border:  0.1rem solid #ff4d4d !important;
    }
    .graphButton:hover .theme--light.v-icon{
        color: white !important;
        caret-color: white !important;
    }
    .graphButtonActive {
        background: rgba(255,77,77, 1);
        border:  0.1rem solid #ff4d4d !important;
    }

</style>
