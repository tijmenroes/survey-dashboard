<template>
    <div >

       <div class="menu">

<div class="leftButtons">
        <ul>
            <li>
                <DataFilter></DataFilter>
            </li>
            <li>
                <ExportComponent :toPrint="toPrint"></ExportComponent>
            </li>
        </ul>


</div>
        <div class="rightButtons">
            <ul>
                <li>
                    <div class="menuButton " @click=""> Terug</div>
                </li>
                <li>
                    <div class="menuButton " @click="restorePage"> Herstel pagina</div>

                </li>
                <li>

                    <v-menu offset-y >
                        <template v-slot:activator="{ on }">
                            <div
                                    class="menuButton selectButton"
                                    v-on="on"
                            >
                                Dashboard
                            </div>
                        </template>

                        <v-list>
                            <v-list-tile @click="">
                                <v-list-tile-title >Dashboard</v-list-tile-title>
                            </v-list-tile>
                            <v-list-tile @click="">
                                <v-list-tile-title>List</v-list-tile-title>
                            </v-list-tile>
                        </v-list>
                    </v-menu>
                </li>
            </ul>

        </div>

        </div>

    </div>
</template>

<script>
    import DataFilter from './Filter.vue'
    import ExportComponent from './ExportComponent.vue'

    export default {
        name: "MenuComponent",
        props: ['toPrint'],
        components: {
            DataFilter, ExportComponent
        },
        methods:{
            restorePage(){
                this.$store.commit('resetData');
                this.$store.commit('ConfigureAnswers');
                //this.$emit('resetPage');
            }
        }
    }
</script>

<style>
    .menu ul {
        min-height: 10%;
        margin: 0;
        padding: 0;
        list-style: none;
        /*float: left;*/
    }
    .menu ul li {
        /*display: inline-block;*/
        /*float: left;*/
        margin-right: 10px;
        margin-bottom: 10px;

    }
    .menuButton {
        /*display:block;*/
        /*width: 100%;*/
        background: #455a64;
        font-size: 14px;
        display: block;
        color:white;
        border: 2px solid #455a64;
        padding: 10px 30px;
        border-radius: 22px;
        margin-right: 10px;
        margin-bottom: 10px;

    }
    .leftButtons .menuButton {
        float:left;
    }
    .rightButtons .menuButton{
        float:right;
    }
    .selectButton {
        color: black;
        background:white;
        padding: 12px 20px;
        border-radius: 22px;
        margin-right: 10px;
        margin-bottom: 10px;
        border: solid 2px #dadada;
    }

    .menu {
        margin-bottom: 30px;
        min-height: 90px;
        padding: 0;

    }
</style>
