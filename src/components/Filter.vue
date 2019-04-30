<template>
    <div>
          <v-menu offset-y v-if="showMenu">
            <template v-slot:activator="{ on }">
                <v-btn
                        color="#475963"
                        dark
                        v-on="on" round
                        class="menuButton text-none"
                >
                    Add Filter <v-icon right>arrow_drop_down</v-icon>
                </v-btn>
            </template>
            <v-list>
                <v-list-tile
                        v-for="(item, index) in vragen"
                        :key="index"
                        @click="selectItem(index)"
                >
                    <v-list-tile-title >{{ item.questionTitle }}</v-list-tile-title>
                </v-list-tile>
            </v-list>
        </v-menu>
        <div v-else>
            <div v-for="(keuzes, index) in vragen[filterStatus].questionChoices">
             <v-checkbox
                :label="keuzes" :value="vragen[filterStatus].questionChoices[index]" v-model="haha[filterStatus].choices" color="#707171">
             </v-checkbox>
            </div>

            <v-btn @click="showMenu = true">Discard</v-btn>
            <v-btn @click="saveFilter(haha[filterStatus].choices, filterStatus)">Save</v-btn>
        </div>


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
              }

            this.haha = array;
        }
    }
</script>

<style >
.menuButton{
    width: 100%;
}
</style>
