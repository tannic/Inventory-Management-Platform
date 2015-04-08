var invenmgtServices = angular.module('invenmgtServices', ['ngResource','ngCookies']);

invenmgtServices.run(function($rootScope, $http, $cookies) {
    $http.defaults.headers.common['X-CSRFToken'] = $cookies.csrftoken;
});

invenmgtServices.factory('Employee', ['$resource', '$http',
  function($resource, $http){
    return $resource('/api/v1/employee/:id/', {id:'@id'}, {
        'query': {
            method: 'GET',
            isArray: true,
            cache: true,
            transformResponse: $http.defaults.transformResponse.concat([
                function (data, headersGetter) {
                    return data.objects;
                }
            ])
        },
        'update': { method:'PUT' }
    });
  }]);

invenmgtServices.factory('Roles', ['$resource', '$http',
  function($resource, $http){
    return $resource('/api/v1/employeerole/:id/', {id:'@id'}, {
        'query': {
            method: 'GET',
            isArray: true,
            transformResponse: $http.defaults.transformResponse.concat([
                function (data, headersGetter) {
                    return data.objects;
                }
            ])
        },
        'update': { method:'PUT' }
    });
  }]);

invenmgtServices.factory('Products', ['$resource', '$http',
    function($resource, $http){
        return $resource('/api/v1/product/:id/', {id:'@id'}, {
        'query': {
            method: 'GET',
            isArray: true,
            transformResponse: $http.defaults.transformResponse.concat([
                function (data, headersGetter) {
                    return data.objects;
                }
            ])
        },
        'update': { method:'PUT' }
    });
}]);

invenmgtServices.factory('Tags', ['$resource', '$http',
    function($resource, $http){
        return $resource('/api/v1/producttags/:id/', {id:'@id'}, {
        'query': {
            method: 'GET',
            isArray: true,
            transformResponse: $http.defaults.transformResponse.concat([
                function (data, headersGetter) {
                    return data.objects;
                }
            ])
        },
        'update': { method:'PUT' }
    });
}]);

invenmgtServices.factory('ProductStatus', ['$resource', '$http',
    function($resource, $http){
        return $resource('/api/v1/productstatus/:id/', {id:'@id'}, {
        'query': {
            method: 'GET',
            isArray: true,
            transformResponse: $http.defaults.transformResponse.concat([
                function (data, headersGetter) {
                    return data.objects;
                }
            ])
        },
        'update': { method:'PUT' }
    });
}]);

invenmgtServices.factory('ProductImage', ['$resource', '$http',
    function($resource, $http){
        return $resource('/api/v1/productimage/:id/', {id:'@id'}, {
        'query': {
            method: 'GET',
            isArray: true,
            transformResponse: $http.defaults.transformResponse.concat([
                function (data, headersGetter) {
                    return data.objects;
                }
            ])
        },
        'update': { method:'PUT' }
    });
}]);

invenmgtServices.factory('PurchaseRecord', ['$resource', '$http',
    function($resource, $http){
        return $resource('/api/v1/productpurchaserecord/:id/', {id:'@id'}, {
        'query': {
            method: 'GET',
            isArray: true,
            transformResponse: $http.defaults.transformResponse.concat([
                function (data, headersGetter) {
                    return data.objects;
                }
            ])
        },
        'update': { method:'PUT' }
    });
}]);

invenmgtServices.factory('InstockRecord', ['$resource', '$http',
    function($resource, $http){
        return $resource('/api/v1/instockrecord/:id/', {id:'@id'}, {
        'query': {
            method: 'GET',
            isArray: true,
            transformResponse: $http.defaults.transformResponse.concat([
                function (data, headersGetter) {
                    return data.objects;
                }
            ])
        },
        'update': { method:'PUT' }
    });
}]);

invenmgtServices.factory('Companys', ['$resource', '$http',
    function($resource, $http){
        return $resource('/api/v1/company/:id/', {id:'@id'}, {
        'query': {
            method: 'GET',
            isArray: true,
            transformResponse: $http.defaults.transformResponse.concat([
                function (data, headersGetter) {
                    return data.objects;
                }
            ])
        },
        'update': { method:'PUT' }
    });
}]);

invenmgtServices.factory('Address', ['$resource', '$http',
    function($resource, $http){
        return $resource('/api/v1/address/:id/', {id:'@id'}, {
        'query': {
            method: 'GET',
            isArray: true,
            transformResponse: $http.defaults.transformResponse.concat([
                function (data, headersGetter) {
                    return data.objects;
                }
            ])
        },
        'update': { method:'PUT' }
    });
}]);

invenmgtServices.factory('Currency', ['$resource', '$http',
    function($resource, $http){
        return $resource('/api/v1/currency/:id/', {id:'@id'}, {
        'query': {
            method: 'GET',
            isArray: true,
            transformResponse: $http.defaults.transformResponse.concat([
                function (data, headersGetter) {
                    return data.objects;
                }
            ])
        },
        'update': { method:'PUT' }
    });
}]);

invenmgtServices.factory('Country', ['$resource', '$http',
    function($resource, $http){
        return $resource('/api/v1/country/:id/', {id:'@id'}, {
        'query': {
            method: 'GET',
            isArray: true,
            transformResponse: $http.defaults.transformResponse.concat([
                function (data, headersGetter) {
                    return data.objects;
                }
            ])
        },
        'update': { method:'PUT' }
    });
}]);

invenmgtServices.factory('SalesChannel', ['$resource', '$http',
    function($resource, $http){
        return $resource('/api/v1/saleschannel/:id/', {id:'@id'}, {
        'query': {
            method: 'GET',
            isArray: true,
            transformResponse: $http.defaults.transformResponse.concat([
                function (data, headersGetter) {
                    return data.objects;
                }
            ])
        },
        'update': { method:'PUT' }
    });
}]);

invenmgtServices.factory('Orders', ['$resource', '$http',
    function($resource, $http){
        return $resource('/api/v1/order/:id/', {id:'@id'}, {
        'query': {
            method: 'GET',
            cache: true,
            isArray: true,
            transformResponse: $http.defaults.transformResponse.concat([
                function (data, headersGetter) {
                    return data.objects;
                }
            ])
        },
        'update': { method:'PUT' }
    });
}]);

invenmgtServices.factory('OrderStatus', ['$resource', '$http',
    function($resource, $http){
        return $resource('/api/v1/orderstatus/:id/', {id:'@id'}, {
        'query': {
            method: 'GET',
            isArray: true,
            transformResponse: $http.defaults.transformResponse.concat([
                function (data, headersGetter) {
                    return data.objects;
                }
            ])
        },
        'update': { method:'PUT' }
    });
}]);

invenmgtServices.factory('OrderRecords', ['$resource', '$http',
    function($resource, $http){
        return $resource('/api/v1/orderrecord/:id/', {id:'@id'}, {
        'query': {
            method: 'GET',
            isArray: true,
            transformResponse: $http.defaults.transformResponse.concat([
                function (data, headersGetter) {
                    return data.objects;
                }
            ])
        },
        'update': { method:'PUT' }
    });
}]);

invenmgtServices.factory('RecordStatus', ['$resource', '$http',
    function($resource, $http){
        return $resource('/api/v1/recordstatus/:id/', {id:'@id'}, {
        'query': {
            method: 'GET',
            isArray: true,
            transformResponse: $http.defaults.transformResponse.concat([
                function (data, headersGetter) {
                    return data.objects;
                }
            ])
        },
        'update': { method:'PUT' }
    });
}]);

invenmgtServices.factory('Invoice', ['$resource', '$http',
    function($resource, $http){
        return $resource('/api/v1/invoice/:id/', {id:'@id'}, {
        'query': {
            method: 'GET',
            isArray: true,
            transformResponse: $http.defaults.transformResponse.concat([
                function (data, headersGetter) {
                    return data.objects;
                }
            ])
        },
        'update': { method:'PUT' }
    });
}]);

invenmgtServices.factory('PaymentMethod', ['$resource', '$http',
    function($resource, $http){
        return $resource('/api/v1/paymentmethod/:id/', {id:'@id'}, {
        'query': {
            method: 'GET',
            isArray: true,
            transformResponse: $http.defaults.transformResponse.concat([
                function (data, headersGetter) {
                    return data.objects;
                }
            ])
        },
        'update': { method:'PUT' }
    });
}]);
