<template>
    <div>

        <div class="boxContainer" v-if="bar">
            <div class="boxContent">
                <dl class="inputje">

                    <v-text-field

                            append-icon="search"
                            label="Search"
                            single-line
                            hide-details
                    ></v-text-field>
                    or
                    <v-menu offset-y >
                        <template v-slot:activator="{ on }">
                            <div
                                    class="keuzeButton"
                                    v-on="on"
                                    append-icon="arrow_drop_down"
                            >
                                Nieuwe filter

                            </div>

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

                </dl>
                <!--<div class="menuButton " @click=""> Terug</div>-->
            </div>

        </div>
    </div>

</template>

<script>
    export default {
        name: "FilterBox",
        data(){
            return {
                bar: true
            }
        },
        mounted(){
           // this.bar = true;
        }
    }
</script>

<style scoped>
    .boxContent {
        padding-top: 0;
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
        margin-top: -30px;
        margin-bottom: 30px;
    }

    .inputje {
        width: 200px;
        height: auto;
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
