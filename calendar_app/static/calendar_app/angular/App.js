
(function(angular){
    "use strict";
var studios = [
      {"code": "WBR", "name": "Warnerbros"},
      { "code": "DIS", "name": "Disney"},
      { "code": "FOC", "name": "Focus"},
      { "code": "UNI", "name": "Universal"},
      { "code": "LGF", "name": "Lionsgate"},
      { "code": "STX", "name": "STX Ent"},
      { "code": "OVT", "name": "Relativity"},
      { "code": "ORD", "name": "Openroad"}

]

var app = angular.module("combo app", ['ngAnimate',  'ngTable', 'ui.bootstrap', 'ngResource']);

var duplicates = {"results":[]};



//service to share data between controllers
app.service("ComboService", function() {
    this.selected_file = null;
    this.fetch_sheet = false;

    this.activeFileChange = function(selected_file){
        this.selected_file = selected_file;
    }


    
});


app.factory("ComboSharedService", function($rootScope){
    var sharedService = {};
    sharedService.prepForBroadcast = function(msg){
       this.message = msg;
       this.broadcastItem();
    };

    sharedService.broadcastItem = function(){
        $rootScope.$broadcast('handleBroadcast');
    };
    return sharedService;

});



//set up a controller for the combos 
app.controller("ComboController", ["$scope", function($scope){
    $scope.combos = combos;


    $scope.select = function(combo){
        $scope.selectedCombo = combo;
    }

    $scope.save = function(){
        $scope.selectedCombo = null;
    }
    }]);

//do a get request and get data 
app.controller("SpreadsheetPreview", ["$scope", "$http",  "ComboSharedService", "NgTableParams",
    function($scope, $http, ComboSharedService, NgTableParams, Studios){
        $scope.activeDataSet = {"results": []};
        $scope.tableParams = new NgTableParams({}, {
            dataset: $scope.activeDataSet.results
            }
         );
         console.log($scope.tableParams.dataset);
        $scope.spreadsheet = [];
        $scope.numPerPage = 10;
        $scope.Studios = studios;
        $scope.total_rows = 0;
        $scope.total_duplicates = 10;
        $scope.duplicateList = {"results": []};
        $scope.fetch_sheet = false;
        $scope.currentPage = 1;
        $scope.maxSize =5;
        $scope.totalItems = $scope.total_rows;
        $scope.bigTotalItems = 0;
        $scope.bigCurrentPage = 1;

        $scope.pageCount = function(){
            return Math.ceil($scope.activeDataSet.results.length/$scope.itemsPerPage);
        }
        $scope.itemsPerPage = 10;
        $scope.currentPage = 1;


        $scope.$on('handleBroadcast', function() {
            $scope.fetch_sheet = true;
            $scope.url = '/spreadsheet_preview.json';
            $scope.file_name = ComboSharedService.message;
            if ($scope.file_name != undefined){
                $scope.url = $scope.url + '/' + $scope.file_name;
                $http.get($scope.url).then(function(result){
                $scope.total_rows = result.data.results.length;

                $scope.filtered_rows = $scope.total_rows;
                $scope.spreadsheet = result.data;
                $scope.mergeKeys = function(element, index, array){
                    element.unique_key = element.content_id + '|' + element.child_content_id;
                    element.unique_key2 = element.content_id + '|' + element.suffix;
                    //element.sheetRowStatus = "ok";
                    //element.description = '';
                }
                console.log('Object beforre Key Merge');
                console.log(result.data);
                $scope.spreadsheet.results.forEach($scope.mergeKeys);
                console.log('Object after keyMerge');
                console.log($scope.spreadsheet);
                $scope.findDuplicatesFilter();
                console.log('Object after DupCheck');
                console.log($scope.spreadsheet);
                $scope.total_duplicates =  $scope.duplicateList.results.length;
                console.log("Checking for duplicates");
                console.log($scope.duplicateList.results);
                $scope.activeDataSet = $scope.spreadsheet;
            });
            }
        });
        
       $scope.pushToDB = function(){
           var pushURL = '/put_spreadsheet.json'
           $http.put(pushURL,$scope.spreadsheet).then(function(result){
               console.log(result)
               $scope.spreadsheet = result.data
               $scope.activeDataSet = $scope.spreadsheet
           });
        }

       $scope.select = function(combo){
           $scope.selectedCombo = combo;
       }
       $scope.translateStudioCode = function(combo){
           var s;
           for(s in $scope.Studios){
               combo.unique_key = combo.content_id + "|" + combo.child_content_id;
               if($scope.Studios[s].code === combo.studio){ return $scope.Studios[s].name; }
           }
       }


       $scope.findDuplicatesFilter = function(){
       //filter to find and set up if duplicates are found
       $scope.filterDupsByUniqueKey = function(object)
       {
           var filterDupKeys = ['unique_key', 'unique_key2'];
	         var dupsFound  = false;
	         var dupCount = 0;
           var errorsFound = 0;
	         var activateDateTime = object.playdate_activation !== ""  ? new Date(object.playdate_activation): null;
           var deactivationDateTime = object.playdate_deactivation !== "" ? new Date(object.playdate_deactivation): null;
           var comboActivation = object.combo_activation !== "" ? new  Date(object.combo_activation): null;
           var message = '';
           var filter_key = 'unique_key';           
           var innerDupFilter = function(o){
                    if( o[filter_key] === object[filter_key]){ return true};
               }
   
           var innerSQLMissingFilter = function(o){
                    if(o[filter_key] === object[filter_key] && o['sql_query'] === undefined){return true};
               }
           var checkForEmptySqlQuery = function(object) {
                   if(object.sql_query === undefined || object.sql_query === null){ return true}
                   return false;
               }
           var checkForInvalidSuffix = function(object) {
                   if(object.suffix.replace('_','').trim().length > 3 || object.suffix === undefined) return true;
                   return false;
               }
           var checkForInvalidDate = function(object, key){
                  
                   if( object[key] !== undefined && object[key] !== null && object[key].length > 1){
                      var d = Date(object[key]);
                      if(d == 'Invalid Date'){
                      return true;
                      }
                      
                  
               }
          return false
        }
              
 	var keyCount =  $scope.spreadsheet.results.filter(innerDupFilter).length;
	      console.log(keyCount);
        filter_key = 'unique_key2';
        var key2Count = $scope.spreadsheet.results.filter(innerDupFilter).length;
         if(keyCount > 1 || key2Count > 1 || checkForEmptySqlQuery(object) || checkForInvalidSuffix(object) || checkForInvalidDate(object,'playdate_activation') || checkForInvalidDate(object,'playdate_deactivation') || checkForInvalidDate(object, 'combo_activation')){
          object.sheetRowStatus = 'error';
          dupsFound = true;
         }
         if(key2Count > 1){
             object.description = object.description + ' The content_id and suffix are duplicated, please make sure that there is only one instance of the suffix for each content_id group';
         }
         if(keyCount > 1){
             object.description = object.description + ' The content_id and child_content_id are duplicated, please make sure that there is one instance of both fields for each content_id group';
         }
         if(checkForEmptySqlQuery(object)){
            object.description = object.description + ' This row has an invalid or empty SQL Query, please fix and re-upload spreadsheet';
         }
         if(checkForInvalidSuffix(object)){
            object.description = object.description +  '  This row has an invalid suffix, the suffix must be of maximum 3 characters, if the spreadsheet has underscores they will be removed the insert SQL Query';
         }
         if(checkForInvalidDate(object, 'playdate_activation')){
            object.description = object.description + ' This row has an invalid playdate activation date/time, please fix and re-upload spreadsheet';
         }
         if(checkForInvalidDate(object, 'playdate_deactivation')){
            object.description = object.description + ' This row has an invalid playdate de-activation date/time, please fix and re-upload spreadsheet';
         }
         if(checkForInvalidDate(object, 'combo_activation')){
            object.description = object.description + ' This row has an invalid combo activation date/time , please fix and re-upload spreadsheet';
         }



	return dupsFound;
       }

       $scope.sortByUniqueKey = function(a,b)
       {
	        if(a.unique_key < b.unique_key) return -1;
	        if(a.unique_key > b.unique_key) return 1;
	        return 0;
       }

      $scope.duplicateList.results = $scope.spreadsheet.results.filter($scope.filterDupsByUniqueKey).sort($scope.sortByUniqueKey);
      }

      $scope.showDuplicates = function(){
          $scope.totalItems = $scope.duplicateList.results.length;
          $scope.activeDataSet = $scope.duplicateList
          $scope.filtered_rows = $scope.duplicateList.results.length;
              $scope.$watch('currentPage + itemsPerPage', function() {
      var begin = (($scope.currentPage - 1) * $scope.itemsPerPage),
        end = begin + $scope.itemsPerPage;

      $scope.filteredDataSet = $scope.activeDataSet.results.slice(begin, end);
    });
      }
      $scope.showOriginal = function(){
         $scope.totalItems = $scope.spreadsheet.results.length;
         $scope.activeDataSet = $scope.spreadsheet
         $scope.filtered_rows = $scope.spreadsheet.results.length;
                       $scope.$watch('currentPage + itemsPerPage', function() {
      var begin = (($scope.currentPage - 1) * $scope.itemsPerPage),
        end = begin + $scope.itemsPerPage;

      $scope.filteredDataSet = $scope.activeDataSet.results.slice(begin, end);
    });


      }
      $scope.setPage = function(pageNo){
          $scope.currentPage = pageNo;
      }


    }
]);


app.filter('startFrom', function() {
    return function(input, start){
        var emptyList = {'results':[]}
        start = +start;
       if(input ==! undefined && input.length > 0) {
        return input.slice(start);
      }      
     
   }
});

//get a list of spreadsheets that are uploaded
app.controller("SpreadsheetList", ["$scope", "$http", "ComboSharedService",
    function($scope, $http,  ComboSharedService){
        $scope.pageSize = 5;
        $scope.currentPage = 0;
        $scope.fetch_list = false;
        $scope.spreadsheetList = [];
        $http.get('/spreadsheet_list.json').then(function(result){
            console.log(result.data);
            $scope.spreadsheetList = result.data;
            $scope.total_rows = result.data.results.length;
            $scope.fetch_list = true;
            $scope.numberOfPages = function(){
                return Math.ceil($scope.spreadsheetList.results.length/$scope.pageSize);
            }
        });
    $scope.select = function(sheet_name){
        ComboSharedService.prepForBroadcast(sheet_name.file_name);
       // console.log(sheet_name.file_name);
//        console.log(ComboService.selected_file);
    }
    }
]);


}(angular));
