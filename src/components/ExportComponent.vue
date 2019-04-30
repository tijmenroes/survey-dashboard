<template>
    <div class="text-xs-center">

        <v-menu offset-y>
            <template v-slot:activator="{ on }">
                <v-btn
                        color="#38C1A7"
                        dark
                        round

                        class="menuButton text-none"
                        v-on="on"
                        :loading="loading"
                >
                    Export as
                    <v-icon right dark>keyboard_arrow_down</v-icon>
                </v-btn>

            </template>
            <v-list>
                <v-list-tile @click="handler('.png')">
                    <v-list-tile-title>.png</v-list-tile-title>
                </v-list-tile>
                <v-list-tile @click="handler('.jpeg')">
                    <v-list-tile-title>.jpeg</v-list-tile-title>
                </v-list-tile>

                <v-list-tile @click="jsonConvert()">
                    <v-list-tile-title>.csv</v-list-tile-title>
                </v-list-tile>
            </v-list>
        </v-menu>
    </div>
</template>

<script>
    export default {
        props: ['toPrint','vragen'],
        data() {
            return {

                loading: false,
            }
        }, methods: {
            handler(imgType){
                this.loading = true;
                this.print(imgType);


            },
            print(imgType) {
                const el = this.toPrint.printMe;
                const options = {
                    type: 'dataURL',
                    backgroundColor: null,
                };
                this.$html2canvas(el, options).then(function (canvas) {
                    saveAs(canvas, 'Overview_ProductSurvey' + imgType);
                });

                function saveAs(uri, filename) {

                    var link = document.createElement('a');

                    if (typeof link.download === 'string') {

                        link.href = uri;
                        link.download = filename;

                        //Firefox requires the link to be in the body
                        document.body.appendChild(link);

                        //simulate click
                        link.click();

                        //remove the link when done
                        document.body.removeChild(link);


                    } else {
                        window.open(uri);

                    }
                }
                this.loading = false;
            },      jsonConvert(){
                //  this.loading = true;
                if (this.vragen.length < 1) {
                    // the array is defined and has at least one element
                    alert("Something went wrong");
                }
                else {
                    this.JSONToCSVConvertor(this.vragen, "ProductSurvey", true);
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
            }
        }
    }
</script>


