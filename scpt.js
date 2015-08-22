
var app = angular.module('plunker', []);

app.constant('resourceMetrics', {
    panelWidth: 117,
    panelHeight: 159,
    left: 20,
    flatItems:6,
    rotatedItems:4
});
app.factory('utilService',function(resourceMetrics){
    var rotateLeft=resourceMetrics.panelWidth/5;
    return {
        getCarouselWidth:function(length){
            return (resourceMetrics.panelWidth*length)+(length-1)*resourceMetrics.left;
        },
        getContainerWidth:function(){
            return (resourceMetrics.panelWidth*resourceMetrics.flatItems)
                +(resourceMetrics.flatItems-1)*resourceMetrics.left+(resourceMetrics.rotatedItems*(rotateLeft+resourceMetrics.left));
        },
        getRotatedLeft:function(){
            return rotateLeft;
        },
        getMaxZIndex:function(){
            return 1000;
        }
    }
})
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
            this.addScope = function (scope) {

                scopes.push(scope);
                if (scopes.length == 1) {
                    _this.openThis(scope);
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
                if(currentPosition<0&&currentIndex){

                    currentPosition+=resourceMetrics.panelWidth+resourceMetrics.left;
                    if(currentPosition<=0){
                        var item=scopes[currentIndex];
                        item.shrunk=true;
                        currentIndex-=1;
                        $element.find('.carousel').css({transform: 'translateX(' + (currentPosition) + 'px )'});
                    }

                }
                if(currentPosition>0){
                    currentPosition=0;
                }
            };

            $scope.next = function () {
                if(scopes.length>resourceMetrics.flatItems){

                }

                if(!currentIndex){
                    currentIndex=resourceMetrics.flatItems-1
                }else{
                    var index=currentIndex+1;
                    if(index>=0 && index<=scopes.length-1){
                        currentIndex=index;
                    }else{
                        return;
                    }
                }
                currentPosition-=resourceMetrics.panelWidth+resourceMetrics.left;
               var item=scopes[currentIndex];
                item.shrunk=false;
                $element.find('.carousel').css({transform: 'translateX(' + (currentPosition) + 'px )'});

            };

        }

    }
})
app.directive("resourceCard", function (resourceMetrics,utilService) {
    return {
        require: '^?communicate',
        template: '<figure ' +
        'ng-click="handleClick()" ng-style="{\'zIndex\':getZindex(),\'width\':getWidth()}" ng-class="{\'main\': isOpen,\'rotate\': rotated}">' +
        '<div class="frame" ng-class="{\'cover\': isCover,\'book\': !isCover}">' +
        '<span class="title">Documents</span>' +
        '<span class="duration">00:08</span>' +
        '</div>' +
        '<div class="back">' +
        '<h1>this is some sample card</h1>'+
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
                    if(scope.index==0){
                        scope.isCover=true;
                    }
                    var width;
                    if(scope.index>=(resourceMetrics.flatItems-1)){
                        scope.shrunk=true;
                    }else{
                        scope.shrunk=false;
                    }
                    element.css({ height: resourceMetrics.panelHeight+"px"});
                    element.find('.frame').css({width:resourceMetrics.panelWidth});
                    element.css({'margin-right':resourceMetrics.left+"px"});
                };
                scope.getZindex=function(){
                    return utilService.getMaxZIndex()-scope.index;
                }
                scope.getWidth=function(){
                    if(scope.shrunk){
                        return utilService.getRotatedLeft()+"px";
                    }else{
                        return resourceMetrics.panelWidth+"px";
                    }
                }
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