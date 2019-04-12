<template>
    <div>
          <v-menu offset-y v-if="showMenu">
            <template v-slot:activator="{ on }">
                <v-btn
                        color="primary"
                        dark
                        v-on="on"
                >
                    Choose Question <v-icon right>arrow_drop_down</v-icon>
                </v-btn>
            </template>
            <v-list>
                <v-list-tile
                        v-for="(item, index) in vragen"
                        :key="index"
                        @click=""

                >
                    <v-list-tile-title @click="selectItem(index)">{{ item.questionTitle }}</v-list-tile-title>
                </v-list-tile>
            </v-list>
        </v-menu>
        <div v-else>
            <div v-for="(keuzes, index) in vragen[filterStatus].questionChoices">
                <!--@click="emit(keuzes, filterStatus)">-->

                <v-checkbox
                        :label="keuzes" :value="vragen[filterStatus].questionChoices[index]" v-model="haha[filterStatus].choices"></v-checkbox></div>

            <v-btn @click="showMenu = true">Discard</v-btn>
            <v-btn @click="saveFilter(haha[filterStatus].choices, filterStatus)">Save</v-btn>
        </div>
        {{showMenu}}

    </div>

</template>

<script>
    //@click="filterke(keuzes, index)"
    export default {
        props: ['vragen'],
        data(){
            return {
                showMenu: false,
                filterStatus: 0,
                selectedChoice: [],
                haha: [],
            }
        },
        methods:{

            selectItem(index){
                this.showMenu = false;
                this.filterStatus = index;

            },saveFilter(answers, question){
                this.showMenu = true;
                this.selectedChoice = [];
                this.$emit('addFilter',answers, question)
            }
        }, created(){
            const array = [];
            for(let vraag in this.vragen){
                array.push({"questionNr": vraag, choices: []});
                for(let keuze in this.vragen[vraag].questionChoices){

                }
            }
            //console.log(array);
            this.haha = array;
        }
    }
</script>

<style scoped>

</style>
