// Code goes here
function getTz(panelSize, numberOfPanels) {
    var tz = Math.round(( panelSize / 2 ) /
    Math.tan(Math.PI / numberOfPanels));
    return tz;
};
var numberOfCards = 15,
    panelSize = 200,
    left = 30,
    panelHeight = 240;
function translateElement(element, tz, ry) {
    element.css({transform: 'translateZ(' + (tz) + 'px ) rotateY(' + (ry) + 'deg )'});
}
var app = angular.module('plunker', []);

app.constant('resourceMetrics', {
    numberOfCards: 15,
    panelWidth: 200,
    left: 30,
    panelHeight: 240
});
app.directive('communicate', function (resourceMetrics) {
    return {
        restrict: 'E',
        replace: true,
        transclude: true,
        template: '<div class="container">' +
        '<button class="prev" ng-click="prev()">prev</button>' +
        '<button class="next" ng-click="next()">next</button>' +
        '<div class="carousel" ng-transclude/>' +
        '</div>',
        compile: function (tElement, tAttrs, transclude) {
            var totalWidth = panelSize + left;
            var tz = getTz(totalWidth, numberOfCards);

        },
        controller: function ($scope, $element) {
            var rotationAngle = 0;

            var scopes = [];
            var lastOpenedScope;
            var basicAngle = 360 / numberOfCards;
            var totalWidth = resourceMetrics.panelWidth + resourceMetrics.left;
            var tz = getTz(totalWidth, resourceMetrics.numberOfCards);
            $element.css({width: totalWidth + "px", height: resourceMetrics.panelHeight});
            $element.find('.carousel').css({transform: 'translateZ(' + (-tz) + 'px ) rotateY(' + (0) + 'deg )'});
            var _this = this;
            this.addScope = function (scope) {

                scopes.push(scope);
                if (scopes.length == 1) {
                    _this.openThis(scope);
                }
                console.log(totalWidth, resourceMetrics.panelWidth, resourceMetrics.panelHeight, resourceMetrics.left, basicAngle, tz)
                scope.init(totalWidth, resourceMetrics.panelWidth, resourceMetrics.panelHeight, resourceMetrics.left, basicAngle, tz);
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
                var angle = -basicAngle * scp.index;
                var requiredAngle = rotationAngle + angle;
                $element.find('.carousel').css({transform: 'translateZ(' + (-tz) + 'px ) rotateY(' + (requiredAngle) + 'deg )'});
             //   scp.scale(1.2);
                scp.isOpen=true;
                lastOpenedScope = scp;
            };

            $scope.prev = function () {
                if (lastOpenedScope) {
                    var index = scopes.indexOf(lastOpenedScope);
                    if (index != -1 && (index - 1) >= 0) {
                        _this.closeLastOpened();
                        _this.openThis(scopes[index - 1])
                    }
                }

            };

            $scope.next = function () {
                if (lastOpenedScope) {
                    var index = scopes.indexOf(lastOpenedScope);
                    if (index != -1 && (index + 1) < scopes.length) {
                        _this.closeLastOpened();
                        _this.openThis(scopes[index + 1])
                    }
                }

            };

        }

    }
})

app.controller("MainCtrl", function ($scope) {

    $scope.items = ["item1", "item2", "item3", "item4", "item5", "item6", "item7"];
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
function getTranslatePosition(panelSize, numberOfPanels) {
    var tz = Math.round(( panelSize / 2 ) /
    Math.tan(Math.PI / numberOfPanels));
    return tz;
}
app.directive("resourceCard", function () {
    return {
        require: '^?communicate',
        template: '<figure ng-click="handleClick()" ng-class="{\'main\': isOpen}">' +
        '<div class="frame">' +
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
            var totalWidth = panelSize + left;
            var tz = getTz(totalWidth, numberOfCards);
            var basicAngle = 360 / numberOfCards;
            var colors = ["#ff5722", "#ff9800", "#ffeb3b", "#9c27b0", "#ffab40", "#7c4dff", "#673ab7"]
            return function (scope, element, attrs, communicationController) {

                scope.init = function (totalWidth, panelWidth, panelHeight, left, basicAngle, tz) {

                    var rotationAngle = basicAngle * scope.index;
                    element.css({width: panelWidth + "px", height: panelHeight, left: left});
                    element.find('.frame').css({'background-color': colors[scope.index]});
                    element.css({transform: 'rotateY(' + rotationAngle + 'deg ) translateZ(' + tz + 'px )'});
                    scope.rotationAngle = rotationAngle;

                };
                scope.handleClick = function () {
                    communicationController.closeLastOpened();
                    communicationController.openThis(scope);

                };

               /* scope.scale = function (scale) {
                    element.find('.frame').css({transform: 'scale(' + scale + ')'});
                }*/
                communicationController.addScope(scope);
            }
        }

    }
});