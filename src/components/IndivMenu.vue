<template>
<v-container fluid grid-list-sm style="padding: 0;">
       <div class="menu">
           <v-layout row wrap>
<v-flex align-self-baseline>
<div class="leftButtons">
        <ul>
            <li>
                <div class="menuButton " @click="sluitBox"> Terug</div>
            </li>

            <li>
                <div class="menuButton filterButton" @click="searchItems"> Filteren</div>
            </li>

            <li>
                <div class="text-xs-center">

                    <v-menu offset-y>
                        <template v-slot:activator="{ on }">
                            <div
                                    color="#38C1A7"
                                    class="menuButton text-none"
                                    v-on="on"
                            >
                                Exporteren <v-icon small color="white">
                                arrow_drop_down
                            </v-icon>
                            </div>
                        </template>
                        <v-list>
                            <v-list-tile @click="exportEmit(0)">
                                <v-list-tile-title>Selectie: {{amountSelected}} items (.csv) </v-list-tile-title>
                            </v-list-tile>

                            <v-list-tile @click="exportEmit(1)">
                                <v-list-tile-title>Alle antwoorden (.csv)</v-list-tile-title>
                            </v-list-tile>
                        </v-list>
                    </v-menu>
                </div>
            </li>
        </ul>
</div>
</v-flex>

           </v-layout>

        </div>
</v-container>

</template>

<script>
    export default {
        name: "MenuComponent",
        props: ["amountSelected"],
        methods:{
            searchItems(){
                this.$store.state.searchActive = !this.$store.state.searchActive;
            },
            sluitBox(){
                this.$store.state.searchActive = false;
            },
            exportEmit(value){
                this.$emit('export', value);
            }
        }
    }
</script>

