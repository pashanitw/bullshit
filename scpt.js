
var app = angular.module('plunker', []);

app.constant('resourceMetrics', {
    panelWidth: 117,
    panelHeight: 159,
    left: 20,
    rotatedItems:4,
    focusIndex:3
});
app.factory('utilService',function(resourceMetrics){
    var rotateLeft=resourceMetrics.panelWidth/5;
    return {
        getCarouselWidth:function(length){
            return (resourceMetrics.panelWidth*length)+(length-1)*resourceMetrics.left;
        },
        getContainerWidth:function(){
                   return 400;
      /*      return (resourceMetrics.panelWidth*resourceMetrics.flatItems)
                +(resourceMetrics.flatItems-1)*resourceMetrics.left+(resourceMetrics.rotatedItems*(rotateLeft+resourceMetrics.left));*/
        },
        getRotatedLeft:function(){
            return rotateLeft;
        },
        getMaxZIndex:function(){
            return 1000;
        },
        getMinZIndex:function(){
            return 0;
        }
    }
});
app.directive('communicate', function (resourceMetrics,utilService) {
    return {
        restrict: 'E',
        replace: true,
        transclude: true,
        scope:{
            length:"="
        },
        template: '<div class="container">' +
        '<button class="prev" ng-click="prev()">prev</button>' +
        '<button class="next" ng-click="next()">next</button>' +
        '<div class="carousel" ng-transclude/>' +
        '</div>',
        compile: function (tElement, tAttrs, transclude) {

        },
        controller: function ($scope, $element,$attrs,$parse) {

            var carouselWidth=utilService.getCarouselWidth($scope.length);
            var containerWidth=utilService.getContainerWidth()
                console.log(carouselWidth,containerWidth);
            $element.css({width: containerWidth + "px", height: (resourceMetrics.panelHeight+100)+ "px"});
            $element.find('.carousel').css({width: carouselWidth + "px"});
            var _this = this;
            var scopes=[];
            var lastOpenedScope;
            var currentPosition=0;
            var currentIndex;
            var defaultCarouselPos;
            var middle=Math.floor($scope.length/2);
            console.log("middle is",middle);
            this.addScope = function (scope) {

                scopes.push(scope);
                if (scopes.length == 1) {
                 //   _this.openThis(scope);
                }
                if(scope.index<middle){
                    scope.isLeft=true;
                    scope.isRight=false;
                    scope.shrunk=true;
                }
                if(scope.index>middle){
                    scope.isLeft=false;
                    scope.isRight=true;
                    scope.shrunk=true;
                }
                if(scope.index==middle){
                    scope.isLeft=false;
                    scope.isRight=false;
                    scope.shrunk=false;
                    scope.isMiddle=true;
                    currentIndex=scope.index;
                     defaultCarouselPos=((currentIndex)*(resourceMetrics.left+utilService.getRotatedLeft()))/2;
                    $element.find('.carousel').css({transform: 'translateX(' + (-defaultCarouselPos) + 'px )'})
                }
                scope.init();
            };
            this.closeLastOpened = function () {
                if (lastOpenedScope) {
                    // lastOpenedScope.scale(1);
                    lastOpenedScope.isOpen=false;
                }
            };
            this.openThis = function (scp) {
                if (lastOpenedScope == scp) {
                    lastOpenedScope = undefined;
                    return;
                }

                 scp.isOpen=true;
                lastOpenedScope = scp;
            };

            $scope.prev = function () {
              var index=currentIndex-1;
                if(index>=0 && index<=scopes.length-1){
                    var currentItem=scopes[currentIndex];
                    currentItem.isLeft=false;
                    currentItem.isMiddle=false;
                    currentItem.isRight=true;
                    currentItem.shrunk=true;
                    currentIndex=index;
                    currentPosition+=(utilService.getRotatedLeft()+resourceMetrics.left);
                    var item=scopes[currentIndex];
                    item.shrunk=false;
                    item.isRight=false;
                    item.isLeft=false;
                    item.isMiddle=true;
                    $element.find('.carousel').css({transform: 'translateX(' + (currentPosition-defaultCarouselPos) + 'px )'})

                }
            };

            $scope.next = function () {
                    var index=currentIndex+1;
                    if(index>=0 && index<=scopes.length-1){
                        var currentItem=scopes[currentIndex];
                        currentItem.isLeft=true;
                        currentItem.isMiddle=false;
                        currentItem.shrunk=true;
                        currentIndex=index;
                    }else{
                        return;
                    }

                currentPosition-=(utilService.getRotatedLeft()+resourceMetrics.left);
               var item=scopes[currentIndex];
                item.shrunk=false;
                item.isRight=false;
                item.isLeft=false;
                item.isMiddle=true;
                $element.find('.carousel').css({transform: 'translateX(' + (currentPosition-defaultCarouselPos) + 'px )'});

            };

        }

    }
})
app.directive("resourceCard", function (resourceMetrics,utilService) {
    return {
        require: '^?communicate',
        template: '<figure ' +
        'ng-click="handleClick()" ng-style="{\'zIndex\':getZindex(),\'width\':getWidth()}" ng-class="{\'main\': isOpen,\'rotate\': rotated,\'middle\':isMiddle,\'rotate-left\':isLeft,\'rotate-right\':isRight}">' +
        '<div class="frame" ng-class="{\'cover\': isCover,\'book\': !isCover}">' +
        '<span class="title">Documents</span>' +
        '<span class="duration">00:08</span>' +
        '</div>' +
        '</figure>',
        restrict: "E",
        replace: true,
        scope: {
            item: "=",
            color: "=",
            data: "=",
            index: "="
        },
        compile: function () {

            var colors = ["#ff5722", "#ff9800", "#ffeb3b", "#9c27b0", "#ffab40", "#7c4dff", "#673ab7"]
            return function (scope, element, attrs, communicationController) {
               scope.rotated=false;
                scope.init = function () {

                    element.css({ height: resourceMetrics.panelHeight+"px"});
                    element.find('.frame').css({width:resourceMetrics.panelWidth});
                    element.css({'margin-right':resourceMetrics.left+"px"});
                };
                scope.getZindex=function(){
                    if(scope.isLeft){
                        element.find('.frame').css({transform: 'translateX(' + (utilService.getRotatedLeft()-resourceMetrics.panelWidth) + 'px )'});
                        return utilService.getMinZIndex()+scope.index;
                    }
                    if(scope.isRight){
                        return utilService.getMaxZIndex()-scope.index;
                    }

                };
                scope.getWidth=function(){
                    if(scope.shrunk){
                        return utilService.getRotatedLeft()+"px";
                    }else{
                        return resourceMetrics.panelWidth+"px";
                    }
                };
                scope.handleClick = function () {
                    communicationController.closeLastOpened();
                    communicationController.openThis(scope);
                };
                communicationController.addScope(scope);
            }
        }

    }
});


app.controller("MainCtrl", function ($scope) {

    $scope.items = ["item1", "item2", "item3", "item4", "item5", "item6", "item7","item8", "item9", "item10", "item11", "item12", "item13", "item14","item15", "item16", "item17"];
    $scope.sortableOptions = {
        'ui-floating': true,
        update: function (e, ui) {
            console.log("update");
            /*      var logEntry = tmpList.map(function(i){
             return i.value;
             }).join(', ');
             $scope.sortingLog.push('Update: ' + logEntry);*/
        },
        stop: function (e, ui) {
            console.log("stopped");
            // this callback has the changed model
            /*      var logEntry = tmpList.map(function(i){
             return i.value;
             }).join(', ');
             $scope.sortingLog.push('Stop: ' + logEntry);*/
        }
    };

})