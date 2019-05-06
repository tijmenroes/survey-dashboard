<template>
    <div>

        <v-menu offset-y v-if="showMenu">
            <template v-slot:activator="{ on }">
                <v-btn
                        class="menuButton text-none"
                        color="#475963"
                        dark round
                        v-on="on"
                >
                    Add Filter
                    <v-icon right>arrow_drop_down</v-icon>
                </v-btn>
            </template>
            <v-list>
                <v-list-tile
                        :key="index"
                        @click="selectItem(index)"
                        v-for="(item, index) in $store.state.configuredSurvey"
                >
                    <v-list-tile-title>{{ item.Title }}</v-list-tile-title>
                </v-list-tile>
            </v-list>
        </v-menu>
        <div v-else>
           Q{{filterStatus}}: {{$store.state.configuredSurvey[filterStatus].Title}}
            <div class="mt-2">
            <div v-for="(keuzes, index) in $store.state.configuredSurvey[filterStatus].questionChoices">
                <v-checkbox
                        :label="keuzes" :value="$store.state.configuredSurvey[filterStatus].questionChoices[index]"
                        color="#707171" v-model="filterVModel[filterStatus].choices" class="selectievakje">
                </v-checkbox>
            </div>
            </div>
            <v-btn @click="discardFilter">Discard</v-btn>

            <v-btn @click="saveFilter(filterVModel[filterStatus].choices, filterStatus)">Save</v-btn>
        </div>

        <v-btn :key="index" @click="delFilter(index)"
               class="text-none" flat v-for="(filter,index)  in $store.state.filters">
            Q{{filter.Question + 1}}: {{filter.Answer.toString()}}
            <v-icon right small> close</v-icon>
        </v-btn>

    </div>

</template>

<script>

    export default {

        data() {
            return {
                showMenu: true,
                filterStatus: 0,
                selectedChoice: [],
                filterVModel: [],
            }
        },
        methods: {
            selectItem(index) {
                this.showMenu = false;
                this.$store.state.filterActive = true;
                this.filterStatus = index;

            }, saveFilter(answers, question) {
                this.showMenu = true;
                this.$store.state.filterActive = false;
                this.selectedChoice = [];
                this.FilterConfig(answers, question);
            },discardFilter(){
                this.showMenu = true;
                this.$store.state.filterActive = false;
            },
            FilterConfig(answer, question) {
                const filterExists = this.filterExists(answer, question);
                if (answer.length === 0) {
                    alert('Selecteer een filter!');
                } else {
                    if (filterExists === false) {
                        this.$store.commit('addFilter', {answer, question});
                        this.$store.commit('ConfigureAnswers');
                        console.log("Filter send to vuex");
                    } else if (filterExists === "bestaat") {
                        this.delFilter(question);
                        this.$store.commit('addFilter', {answer, question});
                        this.$store.commit('ConfigureAnswers');
                    } else {
                        alert('Die filter bestaat al!');
                    }
                }
            },
            filterExists(answer, question) {
                // console.log(answer);
                const filters = this.$store.state.filters;
                if (typeof filters[question] === 'undefined') {
                    return false
                } else {
                    if (filters[question].Code[0].a === answer) {
                        return true;
                    } else {
                        return "bestaat";
                    }
                }
            },
            delFilter(number) {
                this.$store.commit('delFilter', number);
                this.$store.commit('ConfigureAnswers', number);
            }
        }, created() {
            const array = [];
            for (let vraag in this.$store.state.configuredSurvey) {
                array.push({"questionNr": vraag, choices: []});
            }
            this.filterVModel = array;
        }
    }
</script>

<style>
    .menuButton {
        width: 100%;
    }
    .selectievakje{
        padding: 0 !important;
        margin-top: 0 !important;
    }
</style>
