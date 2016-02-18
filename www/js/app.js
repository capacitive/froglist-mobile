// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('froglist', ['ionic', 'ionic.service.core', 'ionic.service.push'])
.controller('froglistController',
  function ($scope, $ionicModal, $ionicPush, $filter) {
  $scope.visibleItem = true;
  $scope.todoItems = [];
  $scope.notifications = [];

  $scope.notifications.push({title: "test1", text: "test1 message", _payload: "{var1: true}"});
  $scope.notifications.push({title: "test2", text: "test2 message", _payload: "{var1: true}"});

  if(localStorage){
    console.log('getting items from localStorage...');
    var storageItems = localStorage.getItem('todoItems');
    if(storageItems !== null){
      $scope.todoItems = JSON.parse(storageItems);
    }
    var notificationItems = localStorage.getItem('notifications');
    if(notificationItems !== null){
      $scope.notifications = JSON.parse(notificationItems);
    }
  }

  $ionicModal.fromTemplateUrl('new-todo.html', function(modal){
    $scope.todoModal = modal;

  }, {
    scope: $scope,
    animation: 'slide-in-left'
  });

  $scope.pushRegisterCallback = function(pushToken){
    alert("Registered device token: " + pushToken.token);
    user.addPushToken(pushToken);
    user.save();
  };

  $scope.registerUser_Notifications = function(){
    Ionic.io();
    var user = Ionic.User.current();

    if(!user.id){
      user.id = Ionic.User.anonymousId();
    }
    user.save();
    //alert('user: ' + user.id);

    $ionicPush.init({
      "debug": false,
      "onRegister": function(data){
        //alert('Ionic Push: registered device token: ' + data.token);
      },
      "onNotification": function(notification){
        var payload = notification.payload;
        alert('Message pushed! Payload: ' + payload);
        $scope.notifications.push(notification);
        //store local:
        localStorage.removeItem('notifications');
        localStorage.setItem('notifications', angular.toJson($scope.notifications));
      }
    });

    $ionicPush.register(function(pushToken){
      //alert("Registered device token: " + pushToken.token);
      user.addPushToken(pushToken);
      user.save();
    });
  };

  ionic.Platform.ready(function(){
    //alert('angular: ionic.Platform.ready');
    $scope.registerUser_Notifications();
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

  $scope.deleteNotification = function(notification){
    //alert('deleting notification: ' + notification.title);
    var notificationArray = $scope.notifications;
    var indexes = $.map(notificationArray, function(obj, index) {
        if(obj.title == notification.title) {
          //alert('found match: ' + obj.title);
          return index;
        }
    });
    var idxN = indexes[0];
    notificationArray.remove(idxN, idxN);

    localStorage.removeItem('notifications');
    localStorage.setItem('notifications', angular.toJson($scope.notifications));
  }

})
.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    //alert('$ionicPlatform.ready');
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
});
