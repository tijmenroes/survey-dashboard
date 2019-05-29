<template>
    <div>
        <div style="padding:0px 16px">
        <MenuIndividual @export="exportHandler" :amountSelected="selected.length"></MenuIndividual>

           <v-expand-transition>
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
                            <v-flex shrink>
                                <div class="menuButton " @click="sluitBox()"> Sluit</div>
                            </v-flex>
                        </v-layout>
                    </dl>
                </v-container>
            </div>
        </v-expand-transition>
        <v-spacer></v-spacer>
        </div>
        <v-container fluid grid-list-xs style="padding: 0 16px !important;">
            <v-layout wrap>
<v-flex xs12 >
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
                                    <span>
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
                                <td v-for="header in headers" :key="props.item[header]" @click="openDialog(props.item)">
                                    {{props.item[header.value]}}
                                </td>
                            </template>
                        </v-data-table>
                    </v-card>
</v-flex>
            </v-layout>

            <v-dialog
                    v-model="dialog"
                    width="600">
                <v-card>
                    <v-card-title>
                        Antwoorden
                    </v-card-title>
                    <v-card-text>
                        <div v-for="key in headers"><p>
                        <strong>{{key.text}}</strong>
                            <br>
                                {{dialogText[key.value]}}
                            </p></div>
                    </v-card-text>
                    <v-divider></v-divider>
                </v-card>
            </v-dialog>
        </v-container>
    </div>
</template>
<script>
    import MenuIndividual from '../components/IndivMenu.vue'
    export default {
        created() {
            this.configureHeaders();
            this.configureRows();
        },
        components:{
            MenuIndividual,
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
            sluitBox(){
              this.$store.state.searchActive = false;
              this.search = '';
            },
            openDialog(info) {
                this.dialog = !this.dialog;
                this.dialogText = info;
            },
            configureHeaders() {
                let headerArray = [];
                headerArray.push({text: "ID", value: "id", hover: "het ID van de respondent"});
                headerArray.push({text: "datum en tijd", value: "dateTime", hover: "het tijdstip wanneer het formulier is ingevuld"});
                const questions = this.$store.state.surveyQuestions;
                for (let question in questions) {
                    const displayQuestion = +question +1;
                    let text =  displayQuestion.toString() + '. ' + questions[question].title;

                    const headerText = text;

                    const number =  question.toString();
                    if(text.length > 35){
                        text = text.slice(0,32);
                        text = text + "...";
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
                                const antwoord =  answer.toString();
                                userArray[antwoord] = answerArray.toString()
                            }else {
                            const antwoord =  answer.toString();
                            userArray[antwoord] = users[user].answers[answer]
                            }
                        }
                    }
                    this.rows.push(userArray);

                }
                this.$store.state.individualData = this.rows;

            },
            checkTime(i) {
            if (i < 10) {i = "0" + i}
            return i;
            },
            exportHandler(value){
                if(value === 1){
                    this.$store.commit('exportCSV', this.rows);
                } else {
                    if (this.selected.length < 1) {
                        alert("Select answers!");
                    } else {
                        this.$store.commit('exportCSV', this.selected);
                    }
                }
            },

         }
        }
</script>

<style scoped>

table.v-table tbody tr:nth-child(even) td {
   background: #fafafa;
}
table.v-table tbody tr:hover{
    background-color: black !important;
}
.headers {
    letter-spacing: -.5px;
    padding-top: 18px;
    padding-bottom: 18px;
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

</style>
