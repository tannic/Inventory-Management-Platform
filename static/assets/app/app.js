
var invenmgtApp = angular.module('invenmgtApp',[
  'ngRoute',
	'invenmgtControllers',
	'invenmgtServices',
  'ui.bootstrap',
  'wu.masonry',
  'angularFileUpload',
  'ngTagsInput', 
  'LocalStorageModule',]);

invenmgtApp.config(['$routeProvider',
  function($routeProvider, $httpProvider, $cookies) {
    $routeProvider
      .when('/employee', {
      	controller:'EmployeeListCtrl',
		    templateUrl:'/site_media/assets/app/templates/employee.html'
      })
      .when('/product', {
        controller:'ProductListCtrl',
        templateUrl:'/site_media/assets/app/templates/product.html'
      })
      .when('/product/:productID', {
        controller:'ProductDetailCtrl',
        templateUrl:'/site_media/assets/app/templates/product-detail.html'
      })
      .when('/product-edit/:productID', {
        controller:'ProductEditCtrl',
        templateUrl:'/site_media/assets/app/templates/product-edit.html'
      })
      .when('/product-new', {
        controller:'ProductNewCtrl',
        templateUrl:'/site_media/assets/app/templates/product-new.html'
      })
      .when('/product-new/:productID', {
        controller:'ProductNewDupCtrl',
        templateUrl:'/site_media/assets/app/templates/product-new.html'
      })
      .when('/purchase-list', {
        controller:'PurchaseRecordCtrl',
        templateUrl:'/site_media/assets/app/templates/purchaserecord.html'
      })
      .when('/purchase-list/:productID', {
        controller:'PurchaseRecordDetailCtrl',
        templateUrl:'/site_media/assets/app/templates/purchaserecord-add.html'
      })
      .when('/purchase-list/:productID/:purchaseID', {
        controller:'PurchaseRecordDetailCtrl',
        templateUrl:'/site_media/assets/app/templates/purchaserecord-add.html'
      })
      .when('/instock-list/:productID', {
        controller:'InstockRecordDetailCtrl',
        templateUrl:'/site_media/assets/app/templates/instockrecord-add.html'
      })
      .when('/instock-list/:productID/:purchaseID/:max', {
        controller:'InstockRecordDetailCtrl',
        templateUrl:'/site_media/assets/app/templates/instockrecord-add.html'
      })
      .when('/product-records/:productID', {
        controller:'ProductRecordsListCtrl',
        templateUrl:'/site_media/assets/app/templates/product-inventory-list.html'
      })
      .when('/customer', {
        controller:'CustomerCtrl',
        templateUrl:'/site_media/assets/app/templates/customer.html'
      })
      .when('/order-add', {
        controller:'OrderNewCtrl',
        templateUrl:'/site_media/assets/app/templates/order-new.html'
      })
      .when('/order', {
        controller:'OrderListCtrl',
        templateUrl:'/site_media/assets/app/templates/order.html'
      })
      .when('/order/:orderID', {
        controller:'OrderDetailCtrl',
        templateUrl:'/site_media/assets/app/templates/order-detail.html'
      })
      .when('/statistics', {
        controller:'StatisticCtrl',
        templateUrl:'/site_media/assets/app/templates/statistics.html'
      })
      .otherwise ({
        controller:'HomeCtrl',
        templateUrl:'/site_media/assets/app/templates/home.html'
      });
  }]);

invenmgtApp.directive('imageonload', function() {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            element.bind('load', function() {
              $('#cards').masonry();
              $('.cards').masonry();
              //grayscale($('.cancelimage'));
            });
        }
    };
});


invenmgtApp.directive('jqSparkline', function () {
        'use strict';
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function (scope, elem, attrs, ngModel) {
 
                 var opts={};
                 //TODO: Use $eval to get the object
                opts.type = attrs.type || 'line';
 
                scope.$watch(attrs.ngModel, function () {
                    render();
                });
                
                scope.$watch(attrs.opts, function(){
                  render();
                }
                  );
                var render = function () {
                    var model;
                    if(attrs.opts) angular.extend(opts, angular.fromJson(attrs.opts));
                    
                    // Trim trailing comma if we are a string
                    angular.isString(ngModel.$viewValue) ? model = ngModel.$viewValue.replace(/(^,)|(,$)/g, "") : model = ngModel.$viewValue;
                    var data;
                    // Make sure we have an array of numbers
                    angular.isArray(model) ? data = model : data = model.split(',');
                    $(elem).sparkline(data, opts);
                };
            }
        }
    });

var INTEGER_REGEXP = /^\-?\d+$/;
invenmgtApp.directive('integer', function() {
  return {
    require: 'ngModel',
    link: function(scope, elm, attrs, ctrl) {
      ctrl.$parsers.unshift(function(viewValue) {
        if (INTEGER_REGEXP.test(viewValue)) {
          // it is valid
          ctrl.$setValidity('integer', true);
          return viewValue;
        } else {
          // it is invalid, return undefined (no model update)
          ctrl.$setValidity('integer', false);
          return undefined;
        }
      });
    }
  };
});


function isEmpty(value) {
  return angular.isUndefined(value) || value === '' || value === null || value !== value;
}

invenmgtApp.directive('ngMin', function() {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, elem, attr, ctrl) {
            scope.$watch(attr.ngMin, function(){
                ctrl.$setViewValue(ctrl.$viewValue);
            });
            var minValidator = function(value) {
              var min = scope.$eval(attr.ngMin) || 0;
              if (!isEmpty(value) && value < min) {
                ctrl.$setValidity('ngMin', false);
                return undefined;
              } else {
                ctrl.$setValidity('ngMin', true);
                return value;
              }
            };

            ctrl.$parsers.push(minValidator);
            ctrl.$formatters.push(minValidator);
        }
    };
});

invenmgtApp.directive('ngMax', function() {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, elem, attr, ctrl) {
            scope.$watch(attr.ngMax, function(){
                ctrl.$setViewValue(ctrl.$viewValue);
            });
            var maxValidator = function(value) {
              var max = scope.$eval(attr.ngMax) || Infinity;
              if (!isEmpty(value) && value > max) {
                ctrl.$setValidity('ngMax', false);
                return undefined;
              } else {
                ctrl.$setValidity('ngMax', true);
                return value;
              }
            };

            ctrl.$parsers.push(maxValidator);
            ctrl.$formatters.push(maxValidator);
        }
    };
});