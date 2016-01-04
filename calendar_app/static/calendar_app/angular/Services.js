(function() {
    "use strict";
    var app = angular.module("comboData", ["ngResource"]);
    
    app.factory("Spreadsheet", ["$resource", 
        function ($resource){
            return $resource("/spreadsheet_preview.json/:id", { filename: '@filename'}, {
                save: {
                    method: "PUT"
                }
             });
        }]);

    app.factory("FileList", ["$resource",
        function ($resource) {
            return $resource("/file_list");
        }]);


}());
