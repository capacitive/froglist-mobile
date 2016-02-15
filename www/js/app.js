// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('froglist', ['ionic']).controller('froglistController', function ($scope, $ionicModal, $filter) {
  $scope.visibleItem = true;
  $scope.todoItems = [];

  if(localStorage){
    console.log('getting items from localStorage...');
    var storageItems = localStorage.getItem('todoItems');
    if(storageItems !== null){
      $scope.todoItems = JSON.parse(storageItems);
    }
  }

  $ionicModal.fromTemplateUrl('new-todo.html', function(modal){
    $scope.todoModal = modal;

  }, {
    scope: $scope,
    animation: 'slide-in-left'
  });

  $scope.createItem = function(item){
    var newId = 0;
    if($scope.todoItems !== null) {
      newId = $scope.todoItems.length + 1;
    }

    if ($scope.todoItems.indexOf(item) == -1) {
      $scope.todoItems.push({id: newId, title: item.title, detail: item.detail});
    }

    localStorage.removeItem('todoItems');
    localStorage.setItem('todoItems', angular.toJson($scope.todoItems));
    $scope.todoModal.hide();
    item.title = "";
    item.detail = "";
  };

  $scope.newItem = function(){
    $scope.todoModal.show();
  };

  $scope.deleteItem = function(item){
    console.log('deleted item: ' + item.title);
    var todoArray = $scope.todoItems;
    var indexes = $.map(todoArray, function(obj, index) {
        if(obj.title == item.title) {
            return index;
        }
    });
    var firstIndex = indexes[0];
    todoArray.remove(firstIndex, firstIndex);

    localStorage.removeItem('todoItems');
    localStorage.setItem('todoItems', angular.toJson($scope.todoItems));
  }

  $scope.closeNewItem = function(){
    $scope.todoModal.hide();
  };

  $scope.toggleItem = function(item){
    if($scope.isItemShown(item)){
      $scope.visibleItem = null;
    } else {
      $scope.visibleItem = item;
    }
  };

  $scope.isItemShown = function(item){
    return $scope.visibleItem === item;
  };

})
.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    var push = new Ionic.Push({
      "debug":true
    });
    push.register(function(){
      console.log("Device token: ", token.token);
    });

    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})
