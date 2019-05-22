<template>
    <div>

        <MenuIndividual @export="jsonConvert"></MenuIndividual>
           <v-expand-transition >
            <div class="boxContainer" v-show="$store.state.searchActive">
                <v-container fluid class="boxContent">
                    <dl class="inputje">
                        <v-layout row wrap grow>
                            <v-flex shrink>
                                <v-text-field
                                        v-model="search"
                                        append-icon="search"
                                        label="Zoeken"
                                        single-line
                                        hide-details
                                        class="choiceMenu"
                                        box
                                        dense
                                        background-color="#fff"
                                ></v-text-field>
                            </v-flex>

                            <v-flex shrink >
                                <div class="menuButton " @click="$store.state.searchActive = false"> Terug</div>

                            </v-flex>

                        </v-layout>

                    </dl>

                </v-container>

            </div>
        </v-expand-transition>
        <v-spacer></v-spacer>

        <v-container fluid grid-list-xs style="padding: 0 !important;">
            <v-layout wrap>
<v-flex xs12>


                    <v-card>
                                  <v-data-table
                                v-model="selected"
                                :headers="headers"
                                no-results-text="Voor deze zoekopdracht zijn geen reacties gevonden"
                                :items="rows"
                                item-key="id"
                                select-all
                                :search="search"
                                :pagination.sync="pagination"
                                :rows-per-page-text="rowsperpage"

                        >
                            <template slot="headerCell" slot-scope="props">
                                <v-tooltip bottom>
                                    <template v-slot:activator="{ on }">
          <span v-on="on" class="headers">
            {{ props.header.text }}
          </span>
                                    </template>
                                    <span >
          {{ props.header.hover }}
        </span>
                                </v-tooltip>
                            </template>

                            <template slot="items" slot-scope="props">


                                <td >
                                    <v-checkbox
                                            v-model="props.selected"
                                            primary
                                            hide-details
                                            color="#455A64"
                                    ></v-checkbox>
                                </td>
                                <td v-for="header in headers" :key="props.item[header]" @click="openDialog(props.item)" class="litty">
                                    {{props.item[header.value]}}
                                </td>

                            </template>
                        </v-data-table>
                    </v-card>
</v-flex>
            </v-layout>
            <br>
            <v-btn @click="jsonConvert">Export to Excel</v-btn>
            <v-dialog
                    v-model="dialog"
                    width="600">
                <v-card>
                    <v-card-title>
                        Antwoorden
                    </v-card-title>
                    <v-card-text>

                        <div v-for="headerke in headers"><p>

                        <strong>{{headerke.text}}</strong>

                            <br>
                                {{dialogText[headerke.value]}}
                            </p></div>
                    </v-card-text>
                    <v-divider></v-divider>
                </v-card>
            </v-dialog>
        </v-container>
    </div>
</template>
<script>
    import MenuIndividual from '../components/MenuIndividual.vue'
    import searchBox from '../components/FilterBoxIndiv.vue'
    export default {
        created() {
            this.configureHeaders();
            this.configureRows();
        },
        components:{
            MenuIndividual,
            searchBox
        },
        data() {
            return {

                dialog: false,
                dialogText: '',
                pagination: {
                    descending: true,
                    rowsPerPage: 10,

                    sortBy: "id",
                    page: 1,
                },
                search: '',
                selected: [],
                headers: [],
                desserts: [],
                rows: [],
                rowsperpage: 'Items per pagina',

            }
        }, methods: {
            openDialog(info) {
                this.dialog = !this.dialog;
                this.dialogText = info;
            },
            configureHeaders() {
                let headerArray = [];
                headerArray.push({text: "ID", value: "id"});
                headerArray.push({text: "date and time", value: "dateTime"});
                const questions = this.$store.state.surveyQuestions;
                for (let question in questions) {
                    var text = 'Q' + question.toString() + '. ' + questions[question].title;
                    const headerText = text;
                    var number = 'q' + question.toString();
                    if(text.length > 35){

                        text = text.slice(0,32);
                        text = text + "...";
                        console.log(text);
                    }
                    headerArray.push({text: text, value: number, hover: headerText})
                }
                this.headers = headerArray;
            }, configureRows(){
                this.rows = [];
                const users = this.$store.state.surveyOldData;

                for (let user in users) {
                    let date = new Date(users[user].dateTime);
                    let month = date.getMonth() + 1;
                    month = this.checkTime(month);
                    let day = date.getDay() + 1;
                    day = this.checkTime(day);
                    let yr = date.getFullYear();
                    let m = date.getMinutes();
                    m = this.checkTime(m);

                    let h  = date.getHours();
                    h = this.checkTime(h);

                    let userArray =  {"id": user, "dateTime": day + '-' + month + '-' + yr + ' ' + h + ':'+  m };
                    for (let answer  in users[user].answers) {
                        if(typeof users[user].answers !== "undefined"){
                            if(typeof users[user].answers[answer] === "object" && users[user].answers[answer] !== "null"){
                                const answerArray = [];
                                for(let keuze in users[user].answers[answer]){
                                    answerArray.push( " " +users[user].answers[answer][keuze].toString() )
                                }

                                const antwoord = 'q' + answer.toString();
                                userArray[antwoord] = answerArray.toString()

                            }else {
                            const antwoord = 'q' + answer.toString();
                            userArray[antwoord] = users[user].answers[answer]
                            }
                        }
                    }
                    this.rows.push(userArray);
                }
            },
            checkTime(i) {
            if (i < 10) {i = "0" + i};  // add zero in front of numbers < 10
            return i;
            },
            jsonConvert() {

                if (this.selected.length < 1) {
                    // the array is defined and has at least one element
                    alert("Select answers!");
                } else {
                    this.JSONToCSVConvertor(this.selected, "ProductSurvey", true);
                }
            }, JSONToCSVConvertor(JSONData, ReportTitle, ShowLabel) {
                //If JSONData is not an object then JSON.parse will parse the JSON string in an Object
                var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;

                var CSV = 'sep=,' + '\r\n\n';

                //This condition will generate the Label/Header
                if (ShowLabel) {
                    var row = "";

                    //This loop will extract the label from 1st index of on array
                    for (var index in arrData[0]) {

                        //Now convert each value to string and comma-seprated
                        row += index + ',';
                    }
                    console.log(row);
                    row = row.slice(0, -1);

                    //append Label row with line break
                    CSV += row + '\r\n';
                    console.log(CSV);
                }

                //1st loop is to extract each row
                for (var i = 0; i < arrData.length; i++) {
                    var row = "";

                    //2nd loop will extract each column and convert it in string comma-seprated
                    for (var index in arrData[i]) {
                        row += '"' + arrData[i][index] + '",';
                    }

                    row.slice(0, row.length - 1);

                    //add a line break after each row
                    CSV += row + '\r\n';
                    console.log(CSV);
                }

                if (CSV == '') {
                    alert("Invalid data");
                    return;
                }

                //Generate a file name
                var fileName = "Report_";
                //this will remove the blank-spaces from the title and replace it with an underscore
                fileName += ReportTitle.replace(/ /g, "_");

                //Initialize file format you want csv or xls
                var uri = 'data:text/csv;charset=utf-8,' + escape(CSV);

                // Now the little tricky part.
                // you can use either>> window.open(uri);
                // but this will not work in some browsers
                // or you will not get the correct file extension

                //this trick will generate a temp <a /> tag
                var link = document.createElement("a");
                link.href = uri;

                //set the visibility hidden so it will not effect on your web-layout
                link.style = "visibility:hidden";
                link.download = fileName + ".csv";

                //this part will append the anchor tag and remove it after automatic click
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            },
        }, watch: {
            // users() {
            //   //  this.configureRows();
            // },
        }
    }
</script>

<style scoped>
 .litty:hover{
     /*background-color:blue!important;;*/
 }
table.v-table tbody tr:nth-child(even) td {
   background: #fafafa;
}
table.v-table tbody tr:hover{
    background-color: black !important;
}
.headers {
    letter-spacing: -.5px;
}

.choiceMenu {
    width: 250px;
    margin: 0;
    padding: 0px 20px;
    position: relative;
}

.boxContent {
    padding: 0;
    margin: 0 auto;
    text-align: left;
}
.boxContainer {
    min-height: 20px;
    padding: 19px;
    position: relative;
    background-color: #f5f5f5;
    border: 1px solid #e3e3e3;
    border-radius: 4px;
    -webkit-box-shadow: inset 0 1px 1px rgba(0,0,0,.05);
    box-shadow: inset 0 1px 1px rgba(0,0,0,.05);

    margin-bottom: 30px;
}

form {
    width: 100%;

}
.keuzeButton{
    background: #fff;
    border: 1px solid #dfdfdf;
    border-radius: 6px;
    padding: 4px;
    min-height: 40px;
    color: #3e3e3e;
}
</style>
