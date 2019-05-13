<template>
    <div>
        Film Survey
        <v-spacer></v-spacer>
        <v-text-field
                v-model="search"
                append-icon="search"
                label="Zoeken"
                single-line
                hide-details
                color="#455A64"
        ></v-text-field>
        <v-container fluid grid-list-xs>
            <v-layout wrap>

                    <v-card>
                                  <v-data-table
                                v-model="selected"
                                :headers="headers"
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
          <span v-on="on" class="text-truncate">
            {{ props.header.text }}
          </span>
                                    </template>
                                    <span >
          {{ props.header.value }}
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
                                <td v-for="header in headers" :key="props.item[header]" @click="openDialog(props.item)" >
                                    {{props.item[header.value]}}
                                </td>

                            </template>
                            <v-alert v-slot:no-results :value="true" color="error" icon="warning">
                                Your search for "{{ search }}" found no results.
                            </v-alert>
                        </v-data-table>
                    </v-card>

            </v-layout>
            <br>
            <v-btn @click="jsonConvert">Export to Excel</v-btn>
            <v-dialog
                    v-model="dialog"
                    width="500">
                <v-card>
                    <v-card-title>
                        Dialog text
                    </v-card-title>
                    <v-card-text>

                        <p v-for="headerke in headers">{{headerke.text}}<br>{{dialogText[headerke.value]}}</p>
                    </v-card-text>
                    <v-divider></v-divider>
                </v-card>
            </v-dialog>
        </v-container>
    </div>
</template>
<script>
    export default {
        created() {
            this.configureHeaders();
            this.configureRows();
        },
        data() {
            return {
                dialog: false,
                dialogText: '',
                pagination: {
                    descending: true,
                    rowsPerPage: 10,
                    //totalItems: 69,
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
                headerArray.push({text: "dateTime", value: "dateTime"});
                const questions = this.$store.state.surveyQuestions;
                for (let question in questions) {
                    var text = 'Q' + question.toString() + '. ' + questions[question].title;
                    var number = 'q' + question.toString();
                    headerArray.push({text: text, value: number})
                }
                this.headers = headerArray;
            }, configureRows(){
                this.rows = [];
                const users = this.$store.state.surveyAnswers;

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

table.v-table tbody tr:nth-child(even) td {
   background-color: #fafafa;
}
</style>
