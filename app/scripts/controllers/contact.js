'use strict';

/**
 * @ngdoc function
 * @name yoomanApp.controller:ContactCtrl
 * @description
 * # ContactCtrl
 * Controller of the yoomanApp
 */
angular.module('yoomanApp')
  .controller('ContactCtrl',['$scope', 'data', function ($scope, data) {

  	$scope.message = "Loading...";
    $scope.rating = {};
    $scope.rating.rate = 5;
    $scope.rating.max = 5;
    $scope.newPost = new data.getComments();
    $scope.mediaRating = 0;

  	$scope.data = { name: "", phone: "", email:"", comment:"", rating:$scope.rating.rate };

  	$scope.dataForm = data.getContact().get(
  		function(success) {
  			$scope.dataForm = success;
  			console.log("data", success);
  		},
  		function(error) {
  			$scope.message = "Error: " + error.text + " " + error.statusText;
  			console.log("Error", $scope.message);
  		});

  	$scope.sendComment = function() {

      $scope.data.rating=$scope.rating.rate;
      console.log("Send Data", $scope.data);
      $scope.newPost.comment = $scope.data;
      data.getComments().save($scope.newPost.comment, function(data){
          console.log("comment update", data + " width id " + data.id);
          $scope.comments.push(data);
          $scope.data = { name: "", phone: "", email:"", comment:"", rating:$scope.rating.rate };
          $scope.contactForm.$setPristine();
          $scope.calculateMedia();
      });
  	};

    

    $scope.comments = data.getComments().query(
      function(success){
        $scope.comments = success;
        console.log("comments", success);
        $scope.calculateMedia();
      },
      function(error){
        $scope.message = "Error: " + error.text + " " + error.statusText;
        console.log("Error", $scope.message);
      });


    $scope.$watch($scope.comments, function(oldVal, newVal) {
          if(newVal) {
            console.log("comment update from watcher");
            $scope.$apply();
          }
        });

    $scope.delete = function(ID, index) {
      console.log("Delete", ID);
      data.getComments().delete({id:ID},
        function(success){
          console.log("comment deleted", success);
          // deletefromView(ID);
          $scope.comments.splice(index, 1);
          $scope.calculateMedia();
        },
        function(error) {
          console.log("error", error+" "+error.text + ": "+ error.statusText);
        });
    };


    $scope.calculateMedia = function()
    {
      if($scope.comments.length<1) {
        $scope.mediaRating = 0;
        $scope.mediaPercent = 0;
        return;
      }
      var count = 0;
       for(var i=0; i<$scope.comments.length; i++)
       {
          console.log("rating: ", $scope.comments[i].rating);
          count += $scope.comments[i].rating;
       }
       $scope.mediaRating = count/$scope.comments.length;
       $scope.mediaPercent = $scope.mediaRating/$scope.rating.rate*100;
       console.log("Percent Rating", $scope.mediaPercent);
       // console.log("Media rating", rating);
    };
    
  }]);
