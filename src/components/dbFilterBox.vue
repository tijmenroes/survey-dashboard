<template>
    <div>
            <v-expand-transition >
                <div class="boxContainer" v-show="$store.state.filterActive">
            <v-container fluid class="boxContent">
                <dl class="inputContainer" v-if="showMenu">
                <v-layout row wrap grow>
                    <v-flex shrink>
                                        <v-autocomplete
                                                v-model="model"
                                                :items="searchItems"
                                                label="Kies vraag"
                                                box
                                                single-line
                                                background-color="#fff"
                                                class="choiceMenu"
                                                dense
                                        >
                                        </v-autocomplete>
                    </v-flex>

                    <v-flex shrink >
                        <div class="menuButton sluitButton" @click="$store.state.filterActive = false"> Sluiten</div>
                    </v-flex>
                </v-layout>
                </dl>
                <div v-else>
                    {{+filterStatus + 1}}. {{$store.state.configuredSurvey[filterStatus].Title}}
                    <div class="mt-2">
                        <v-layout column row>
                        <v-flex xs6  lg8 v-for="(keuzes, index) in $store.state.configuredSurvey[filterStatus].questionChoices">
                            <v-checkbox
                                    :label="keuzes" hide-details :value="$store.state.configuredSurvey[filterStatus].questionChoices[index]"
                                    color="#707171" v-model="filterVModel[filterStatus].choices" class="selectievakje"  >
                            </v-checkbox>
                        </v-flex>
                        </v-layout>
                    </div>
                    <ul class="buttonsUnder">
                        <li>
                            <div class="saveButton menuButton" @click="saveFilter(filterVModel[filterStatus].choices, filterStatus)">
                                Opslaan
                            </div>
                        </li>
                        <li>
                            <div class="backButton menuButton"  @click="discardFilter">
                                Sluit
                            </div>
                        </li>
                    </ul>
                </div>
            </v-container>

        </div>
            </v-expand-transition>

        <div v-if="$store.state.filters.length > 0">
            <h3>FILTERS</h3>

            <div class="filterList">
                <v-menu offset-x top v-for="(filter,index)  in $store.state.filters" class="filterContainer" >
                    <template v-slot:activator="{ on }" >
                        <div
                                color="#38C1A7"
                                class="chippie "
                                v-on="on"
                        >
                            Q{{filter.Question}}: {{filter.Answer.toString()}}
                            <v-icon   small color="455a64" class="chipIcon">
                            more_vert
                        </v-icon>
                        </div>
                    </template>
                    <v-list>
                        <v-list-tile @click="editFilter(filter.Code[0].q, filter.Answer)">
                            <v-list-tile-title>Filter aanpassen</v-list-tile-title>
                        </v-list-tile>
                        <v-list-tile @click="delFilter(index)">
                            <v-list-tile-title style="color: #f64a48">Filter verwijderen</v-list-tile-title>
                        </v-list-tile>
                    </v-list>
                </v-menu>
            </div>
        </div>
    </div>

</template>

<script>
    export default {
        watch:{
          model(){
              for(let vraag in this.$store.state.configuredSurvey){
                  if(this.$store.state.configuredSurvey[vraag].Title === this.model){
                   this.filterStatus = vraag;
                   this.model= [];
                   this.showMenu = false;
                  }
              }
          }
        },
        data(){
            return {
                showMenu: true,
                bar: false,
                searchItems: [],
                filterStatus: 0,
                selectedChoice: [],
                filterVModel: [],
                model: [],
            }
        },
        methods: {
            editFilter(index){
                //Wanneer de gebruiker op filter aanpassen klikt,
                this.showMenu = false;
                this.$store.state.filterActive = true;
                this.filterStatus = index;
            },
            selectItem(index) {
                //wanneer de gebruiker een vraag pickt
                this.showMenu = false;
                this.$store.state.filterActive = true;
                this.filterStatus = index;
            }, saveFilter(answers, question) {
                //Sla filter op
                this.showMenu = true;
                this.selectedChoice = [];
                this.FilterConfig(answers, question);
            },discardFilter(){
                //Filter wordt niet opgeslagen
                this.showMenu = true;
                this.$store.state.filterActive = false;
            },
            FilterConfig(answer, question) {
                //Een check of de filter wel mag worden uitgevoerd, en welke functies moeten worden uitgevoerd.
                if (answer.length === 0) {
                    alert('Selecteer een filter!');
                } else {
                    const get = this.filterExists(answer, question);
                    const filterExists = get.exists;
                    if (filterExists === false) {
                        this.$store.commit('addFilter', {answer, question});
                        this.$store.commit('ConfigureAnswers');
                    } else if (filterExists === "bestaat") {
                        this.$store.commit('delFilter', get.number);
                        this.$store.commit('addFilter', {answer, question});
                        this.$store.commit('ConfigureAnswers');
                    } else {
                        alert('Die filter bestaat al!');
                    }
                }
            },
            filterExists(answer, question) {
                //Een check of de filter al bestaat.
                let outcome = {exists: '', number: null};
                let number = null;
                const filters = this.$store.state.filters;
                for(let filter in filters){
                    if (typeof filters[filter] !== 'undefined') {
                        if(filters[filter].Code[0].q === question){
                            number = filter;
                            outcome.number = filter;
                        }
                    }
                }
                if(number === null){
                    outcome.exists = false;
                } else {
                    if (filters[number].Code[0].a === answer) {
                        outcome.exists = true;
                    } else {
                        outcome.exists = "bestaat";
                    }
                }
                return outcome;
            },
            delFilter(number) {
                //Delete filter
                this.filterVModel[number].choices = [];
                this.$store.commit('delFilter', number);
                this.$store.commit('ConfigureAnswers', number);
            }
        }, created() {
            const array = [];
            const array2 = [];
            //Tekstvragen worden eruit gehaald, deze hoeven niet gefiltered te worden.
            for (let vraag in this.$store.state.configuredSurvey) {
                if(this.$store.state.configuredSurvey[vraag].Type  !== 5) {
                    array.push({"questionNr": vraag, choices: []});
                    array2.push(this.$store.state.configuredSurvey[vraag].Title)
                }
            }

            this.searchItems = array2;
            this.filterVModel = array;
        }
    }
</script>

<style scoped>
    .buttonsUnder{
        margin-top: 25px;
    }
    ul {
        display:inline-block;
        padding-left: 0;
    }
    li{
        display:inline-block;
    }
    .chipIcon {
     font-size: 18px !important;

    }
    .saveButton {
        padding: 8px 25px;
        background: #00bfa5;
        border: 2px solid #00bfa5;
    }
    .saveButton:hover{
        background: #009688;
        border: 2px solid #009688;
    }
    .backButton{
        padding: 8px 25px;
    }
    .sluitButton {
        margin-left: 20px;
    }
    .choiceMenu {
        width: 250px;
        margin: 0;
        padding: 0px 20px;
        position: relative;
    }
    .selectievakje{
        padding: 0 !important;
        margin-top: 6px !important;
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
    .filterList {
        margin-top: 15px;
        margin-bottom: 15px;
    }
    h3{
        font-size: 12px;
        font-weight: 700;
        color: #40475f;
        padding: 0 0 10px 0;
        border-bottom: 1px solid #e3e8e9;
        text-transform: uppercase;
        letter-spacing: 1px;
    }
    .chippie{

        cursor: pointer !important;
        background: #fff;
        font-size: 12px;
        display: inline-block;
        border-radius: 22px;
        font-weight: 600;
        padding: 8px 20px;
        border: 3px solid #00bfa5 !important;
        -webkit-transition: .3s;
        transition: .3s;
        margin-right: 15px;
    }
    .filterContainer{
        display: inline-block;
    }
    .chippie:hover {
        background: #00bfa5;
        color: white;
    }
    .chippie:hover .chipIcon{
        color: white !important;
    }
    form {
        width: 100%;
    }
</style>
