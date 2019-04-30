<template>
    <div>

        {{users}}
        <v-container fluid grid-list-xs>
            <v-layout wrap>
                <v-flex xs10 class="pa-3">
                    <v-card>
                        <v-card-title>
                            Individual Responses
                            <v-spacer></v-spacer>
                            <v-text-field
                                    v-model="search"
                                    append-icon="search"
                                    label="Search"
                                    single-line
                                    hide-details
                            ></v-text-field>
                        </v-card-title>
                        <v-data-table
                                v-model="selected"
                                :headers="headers"
                                :items="desserts"
                                item-key="name"
                                select-all
                                :search="search"
                        >
                            <template slot="headerCell" slot-scope="props" style="width:20px">
                                <v-tooltip bottom>
                                    <template v-slot:activator="{ on }">
          <span v-on="on" class="text-truncate">
            {{ props.header.text }}
          </span>
                                    </template>
                                    <span  style="width: 10px">
          {{ props.header.value }}
        </span>
                                </v-tooltip>
                            </template>

                            <template slot="items" slot-scope="props">
                                <td>
                                    <v-checkbox
                                            v-model="props.selected"
                                            primary
                                            hide-details
                                    ></v-checkbox>
                                </td>
                                <td v-for="header in headers" :key="props.item[header]" @click="openDialog(props.item)">
                                    {{props.item[header.value]}}
                                </td>

                            </template>
                            <v-alert v-slot:no-results :value="true" color="error" icon="warning">
                                Your search for "{{ search }}" found no results.
                            </v-alert>
                        </v-data-table>
                    </v-card>
                </v-flex>
            </v-layout>
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
        name: 'Individual',
        props: ['users', 'questions'],
        created() {
            this.configureHeaders();
            this.configureRows();
        },
        data() {
            return {
                dialog: false,
                dialogText: '',
                pagination: {
                    sortBy: 'name'
                },
                reactiveUsers: this.users,
                search: '',
                selected: [],
                lol: [{"name": "13-06-2019 16:06:32"}, {"q1": "Niet normaal hoe tevreden ik ben echt niet normaal het is gewoon echt abnormaal ik ben zo tevreden"}, {
                    "q2": "Super, maar dan ook echt super tevreden zeg",
                    "q3": "De stoelen zaten erg oncomfortabel",
                    "q4": "Tevreden",
                    "q5": "Niet normaal hoe tevreden ik ben echt niet normaal het is gewoon echt abnormaal ik ben zo tevreden",
                    "q6": "Niet normaal hoe tevreden ik ben echt niet normaal "
                }],
                headers: [
                    // {text: 'Date time', value: 'name'},
                    {text: 'Q0.', value: "q0"},
                    {text: 'Q1.', value: "q1"},
                    {text: 'Q2. Bent u tevreden over uw laatste bezoek?', value: 'q2'},
                    {text: 'Q3. Bent u tevreden over uw laatste bezoek?', value: 'q3'},

                ],
                desserts: []
            }
        }, methods: {
            openDialog(info) {
                this.dialog = !this.dialog;
                this.dialogText = info;
            },
            configureHeaders() {
                let headerArray = [];
                for (let question in this.questions) {
                    var text = 'Q' + question.toString() + '. ' + this.questions[question].questionTitle;
                    var number = 'q' + question.toString();
                    headerArray.push({text: text, value: number})
                }
                this.headers = headerArray;
            }, configureRows(){
                this.desserts = [];
                for (let user in this.users) {
                    let userArray = {'answers': {}};
                    for (let answer  in this.users[user].answers) {

                        var antwoord = 'q' + answer.toString();

                        // userArray.answers.push([antwoord]: this.users[user].answers[answer])
                        userArray.answers[antwoord] = this.users[user].answers[answer]

                    }
                   // this.desserts = [];
                    this.desserts.push(userArray.answers);
                }
                // console.log(userArray)
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

</style>
