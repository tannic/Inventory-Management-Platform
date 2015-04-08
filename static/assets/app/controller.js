var invenmgtControllers = angular.module('invenmgtControllers', []);


//Employee
var NewEmployeeCtrl = function($scope, Roles, $modalInstance){
    $scope.roles = Roles.query();
    $scope.newemployee={};
    $scope.emailvalid=false;
    $scope.usernamevalid=false;
    $scope.ok = function () {
      $.ajax({
        async:false,
        url:'/api/v1/signup/checkusername/',
        method:'POST',
        data: {
          username:$scope.newemployee.username
        },
        success:function(response){
          $scope.usernamevalid = response.success;
        },
        error:function(response){
          $scope.usernamevalid = true;
          console.log(response);
        },
      });

      $.ajax({
        async:false,
        url:'/api/v1/signup/checkemail/',
        method:'POST',
        data: {
          email:$scope.newemployee.email
        },
        success:function(response){
          $scope.emailvalid = response.success;
        },
        error:function(response){
          $scope.emailvalid = true;
          console.log(response);
        },
      });
      if(!$scope.emailvalid&&!$scope.usernamevalid){
        $modalInstance.close($scope.newemployee);
      }
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
  };

var ViewEmployeeCtrl = function($scope, Roles, $modalInstance, employee, rolechange){
    $scope.roles = Roles.query(
      function(response){
        for(var i=0;i<response.length;i++){
          if(response[i].id==employee.employee_role.id)
          {
            employee.employee_role=response[i];
          }
        }
      });
    $scope.newemployee=employee;
    $scope.emailvalid=false;
    $scope.usernamevalid=false;
    $scope.editable=false;
    $scope.changpwd=false;
    $scope.rolechange=rolechange;
    $scope.edit=function(){
      $scope.editable=true;
    }
    $scope.chgpwd=function(){
      $scope.changepwd=true;
    }
    $scope.ok = function () {
      $.ajax({
        async:false,
        url:'/api/v1/signup/checkusername/',
        method:'POST',
        data: {
          username:$scope.newemployee.username
        },
        success:function(response){
          $scope.usernamevalid = response.success&&(response.id!=$scope.newemployee.id);
        },
        error:function(response){
          $scope.usernamevalid = true;
          console.log(response);
        },
      });

      $.ajax({
        async:false,
        url:'/api/v1/signup/checkemail/',
        method:'POST',
        data: {
          email:$scope.newemployee.email
        },
        success:function(response){
          $scope.emailvalid = response.success&&(response.id!=$scope.newemployee.id);
        },
        error:function(response){
          $scope.emailvalid = true;
          console.log(response);
        },
      });

      if(!$scope.emailvalid&&!$scope.usernamevalid){
        $modalInstance.close($scope.newemployee);
      }
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
  };

invenmgtControllers.controller('EmployeeListCtrl',['$scope', '$modal' , '$http','Employee', 'Roles', 
  function($scope, $modal, $http, Employee, Roles){
    $http.get('/api/v1/signup/login').success(function(response){
      $scope.currentuser=Employee.get({'id':response.id},function(){
        $scope.isAdmin=($scope.currentuser.employee_role.role=='admin');
        $scope.isMgr=($scope.currentuser.employee_role.role=='mgr');
        $scope.isSales=($scope.currentuser.employee_role.role=='sales');
        $scope.isInvenmgr=($scope.currentuser.employee_role.role=='invenmgr');
        $scope.isAccount=($scope.currentuser.employee_role.role=='account');
        if(!$scope.isAdmin&&!$scope.isMgr){
          angular.element(".admin").remove();
        }
      });
    });
    $scope.roles = Roles.query(
      function(){
        for(var i=0;i<$scope.roles.length;i++){
          $scope.roles[i].checked=false;
        }
      });
    $scope.activenumber=0;
    $scope.selectedrole = {};  
    $scope.employees = Employee.query(
      function(){
        for(var i=0;i<$scope.employees.length;i++){
          if($scope.employees[i].is_active){
            $scope.activenumber++;
          }       
        }
      });
    $scope.showinactive=false;

    $scope.listview = false;
    $scope.cardview = true;
    $scope.selectrole=function(id){
      for(var i=0;i<$scope.roles.length;i++){
        if($scope.roles[i].id==id){
          if($scope.roles[i].checked){
            $scope.roles[i].checked=false;
            $scope.selectedrole={};
          }
          else{
            $scope.roles[i].checked=true;
            $scope.selectedrole=$scope.roles[i];  
          }   
        }
        else{
          $scope.roles[i].checked=false;
        }
      }
    };
    $scope.filterrole=function(employee){
      if(!$scope.selectedrole.id){
        return true;
      }
      return $scope.selectedrole.id==employee.employee_role.id;
    }
    $scope.clickshowinactive=function(){
      $scope.showinactive=!$scope.showinactive;
    }
    $scope.filteractive=function(employee){
      if($scope.showinactive){
        return true;
      }
      else{
        return employee.is_active;
      }
    }
    $scope.delEmployee = function(selectedid){

      for(var i=0;i<$scope.employees.length;i++){
          if($scope.employees[i].id==selectedid){
            $scope.employees[i].$delete(
              function(){
                $scope.activenumber=$scope.activenumber-1;
                $scope.employees=Employee.query();
              },
              function(response){
                console.log(response);
                $scope.employees=Employee.query();
                alert("Cannot deactivate this employee! You do not have sufficient previllige.")
              });
            //Employee.update({id:selectedid},$scope.employees[i]);
          }
        }
    };
    $scope.actEmployee = function(selectedid){
      for(var i=0;i<$scope.employees.length;i++){
          if($scope.employees[i].id==selectedid){
            $scope.employees[i].is_active=true;
            $scope.employees[i].employee_role=$scope.employees[i].employee_role.resource_uri;
            $scope.employees[i].$update(
              function(){
                $scope.activenumber=$scope.activenumber+1;
                $scope.employees=Employee.query();
              },
              function(response){
                console.log(response);
                $scope.employees=Employee.query();
                alert("Cannot reactivate this employee! You do not have sufficient previllige.")
              });
            //Employee.update({id:selectedid},$scope.employees[i]);
          }
        }
    }
    $scope.startlist = function(){
      $scope.listview = true;
      $scope.cardview = false;
    };
    $scope.startcard = function(){
      $scope.listview = false;
      $scope.cardview = true;
    };
    $scope.open = function () {
      var modalInstance = $modal.open({
        templateUrl: 'newemployee.html',
        controller: NewEmployeeCtrl,
      });

      modalInstance.result.then(function (newemployee) {
        newemployee.employee_role = newemployee.employee_role.resource_uri;
        Employee.save(newemployee,
          function(response){
            console.log(response);
            $scope.employees = Employee.query();
          },
          function(response){
            console.log(response);
          });
      });
    };
    $scope.view = function (employee) {
      var modalInstance = $modal.open({
        templateUrl: 'viewemployee.html',
        controller: ViewEmployeeCtrl,
        resolve:{
          employee: function(){
          return employee;
          },
          rolechange: function(){
            return $scope.currentuser.employee_role.role=='admin'||$scope.currentuser.employee_role.role=='mgr';
          }
        } 
      });
      modalInstance.result.then(function(newemployee){
        newemployee.employee_role = newemployee.employee_role.resource_uri;
        newemployee.belong_to = newemployee.belong_to.resource_uri;
        newemployee.$update(
          function(response){
            console.log(response);
            $scope.employees = Employee.query();
          },
          function(response){
            $scope.employees = Employee.query();
            console.log(response);
          });
      });
    };

  }]);

//Product
var ViewProductCtrl = function($scope, $location, product, $modalInstance){
    $scope.product = product;

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
    $scope.viewinventory = function () {
      $location.url('/product-records/'+product.id);
      $modalInstance.dismiss('cancel');
    };
  };

invenmgtControllers.controller('ProductListCtrl', ['$http','$scope', '$modal', 'Products','Employee','Tags',
  function($http, $scope, $modal, Products, Employee, Tags){
    $http.get('/api/v1/signup/login').success(function(response){
      $scope.currentuser=Employee.get({'id':response.id},function(){
        $scope.isAdmin=($scope.currentuser.employee_role.role=='admin');
        $scope.isMgr=($scope.currentuser.employee_role.role=='mgr');
        $scope.isSales=($scope.currentuser.employee_role.role=='sales');
        $scope.isInvenmgr=($scope.currentuser.employee_role.role=='invenmgr');
        $scope.isAccount=($scope.currentuser.employee_role.role=='account');
        if(!$scope.isAdmin&&!$scope.isMgr){
          angular.element(".admin").remove();
        }
      });
    });
    $scope.activenumber=0;
    $scope.outstocknumber=0;
    $scope.products=[];
    function loadproductrecords(limit, offset){
      var products=Products.query({'limit':limit, 'offset':offset, 'order_by': '-id'},
        function(response){
          if(response.length!=0){
            loadproductrecords(limit, limit+offset);
          }

          for(var i=0;i<products.length;i++){
            var index=i;
            products[i].rrp=parseFloat(products[i].rrp);
            if(products[i].inventory_status.name=="Active"){
              $scope.activenumber++;
            }
            if(products[i].inventory_free<=products[i].min_qty&&products[i].inventory_status.name=="Active"){
              $scope.outstocknumber++;
              products[i].style={"background-color":"#F4A9BB","color":"#FFFFFF"};
            }
            else if(products[i].inventory_status.name=="Active"){
              products[i].style={"background-color":"#E1ECDE"};
            }
            $scope.products.push(products[i]);
          }       
        });  
    }
    loadproductrecords(20, 0);

    $scope.tags=Tags.query(
      function(){
        for(var i=0;i<$scope.tags.length;i++){
          $scope.tags[i].checked=false;
        }
      });
    $scope.tagfilter=function(product){
      for(var i=0;i<$scope.tags.length;i++){
        if($scope.tags[i].checked){
          var hastag=false;
          for(var j=0;j<product.tag.length;j++){
            if($scope.tags[i].id==product.tag[j].id){
              hastag=true;
            }
          }
          if(!hastag){
            return false;
          }
        }
      }
      return true;
      };
    $scope.selectedtag=function(id){
      for(var i=0;i<$scope.tags.length;i++){
        if($scope.tags[i].id==id){
          if($scope.tags[i].checked){
            $scope.tags[i].checked=false;
          }
          else{
            $scope.tags[i].checked=true;
          }
        }
      }
      };
    $scope.showinactive==false;
    $scope.clickshowinactive=function(){
      $scope.showinactive=!$scope.showinactive;
    }
    $scope.activefilter=function(product){
      if($scope.showinactive){
        return true;
      }
      else{
        return product.inventory_status.name=="Active";
      }   
    }
    $scope.showoutstock=false;
    $scope.outstockfilter=function(product){
      if(!$scope.showoutstock){
        return true;
      }
      return product.inventory_free<=product.min_qty;
    };
    $scope.clickshowoutstock=function(){
      $scope.showoutstock=!$scope.showoutstock;
    };
    $scope.orderbyoptions=[
      {'name':'create date: newest to oldest','orderBy':'-id'},
      {'name':'create date: oldest to newest','orderBy':'id'},
      {'name':'RRP: lowest to highest','orderBy':'rrp'},
      {'name':'RRP: highest to lowest','orderBy':'-rrp'},
      {'name':'name: A to Z','orderBy':'name'},
      {'name':'name: Z to A','orderBy':'-name'},
      {'name':'nearly out of stock first', 'orderBy':'inventory_free>min_qty'},
    ];
    $scope.cardview=true;
    $scope.listview=false;
    $scope.oldview=false;
    $scope.startcard=function(){
      $scope.cardview=true;
      $scope.listview=false;
    };
    $scope.startlist=function(){
      $scope.listview=true;
      $scope.cardview=false;
    };
    $scope.deleteproduct=function(product){
      var p=angular.copy(product);
      p.inventory_status="/api/v1/productstatus/2";
      p.$update(function(response){
        product.inventory_status=response.inventory_status;
      },function(response){
        console.log(response);
      });
    };
  }]);

invenmgtControllers.controller('ProductDetailCtrl', ['$http','$scope', '$routeParams', '$modal','Products', 'Employee',
  function($http, $scope, $routeParams, $modal, Products, Employee){
    $http.get('/api/v1/signup/login').success(function(response){
      $scope.currentuser=Employee.get({'id':response.id},function(){
        $scope.isAdmin=($scope.currentuser.employee_role.role=='admin');
        $scope.isMgr=($scope.currentuser.employee_role.role=='mgr');
        $scope.isSales=($scope.currentuser.employee_role.role=='sales');
        $scope.isInvenmgr=($scope.currentuser.employee_role.role=='invenmgr');
        $scope.isAccount=($scope.currentuser.employee_role.role=='account');
        if(!$scope.isAdmin&&!$scope.isMgr){
          angular.element(".admin").remove();
        }
      });
    });
    $scope.product=Products.get({ id:$routeParams.productID },
      function(){
        $scope.thumbnaillist=$scope.product.image.slice($scope.thumbnailnumber,$scope.thumbnailnumber+4);
        $scope.selectedimg=$scope.product.image[0];
      });
    $scope.thumbnailnumber=0;
    
    $scope.thumbnaildown=function(){
      if($scope.thumbnailnumber+4<=$scope.product.image.length){
        $scope.thumbnailnumber++;
        $scope.thumbnaillist.splice(0,1);
        $scope.thumbnaillist.push($scope.product.image[$scope.thumbnailnumber+3]);
      }
    };
    $scope.thumbnailup=function(){
      if($scope.thumbnailnumber>0){
        $scope.thumbnailnumber=$scope.thumbnailnumber-1;
        $scope.thumbnaillist.pop();
        $scope.thumbnaillist.splice(0,0,$scope.product.image[$scope.thumbnailnumber]);
      }
    };
    
    $scope.clickselectimg=function(image){
      $scope.selectedimg=image;
    };

    $scope.view = function (product) {
      var modalInstance = $modal.open({
        templateUrl: 'productmoreinfo.html',
        controller: ViewProductCtrl,
        resolve:{
          product: function(){
            return product;
          },
        } 
      });
    };
  }]);

invenmgtControllers.controller('ProductNewCtrl', ['$scope', '$upload', '$timeout', '$location', 'Products', 'Employee', 'Tags', 'ProductStatus',
  function($scope, $upload, $timeout, $location, Products, Employee, Tags, ProductStatus){
    $scope.product={};
    $scope.tags=Tags.query();
    $scope.product.tag=[];
    $scope.status=ProductStatus.query();
    $scope.submit=false;

    //load current user
    $.ajax({ 
        url:'/api/v1/signup/login',
        method:'GET',
        success:function(response){
          $scope.currentuser = Employee.get({id:response.id});
        },
        error:function(response){
          console.log(response);
        },
      });

    $scope.images={};
    $scope.file={};
    $scope.changeInven=function(change){
      if(!$scope.product.inventory_free){
        $scope.product.inventory_free=0;
      }
      $scope.product.inventory_free=parseFloat($scope.product.inventory_free);
      $scope.product.inventory_free=$scope.product.inventory_free+change;
      if($scope.product.inventory_free<=0){
        $scope.product.inventory_free=0;
      }
    };
    $scope.changeAlertInven=function(change){
      if(!$scope.product.min_qty){
        $scope.product.min_qty=0;
      }
      $scope.product.min_qty=parseFloat($scope.product.min_qty);
      $scope.product.min_qty=$scope.product.min_qty+change;
      if($scope.product.min_qty<=0){
        $scope.product.min_qty=0;
      }
    };
    $scope.changeLeadtime=function(change){
      if(!$scope.product.leadtime){
        $scope.product.leadtime=0;
      }
      $scope.product.leadtime=parseFloat($scope.product.leadtime);
      $scope.product.leadtime=$scope.product.leadtime+change;
      if($scope.product.leadtime<=0){
        $scope.product.leadtime=0;
      }
    };
    $scope.changeRrp=function(change){
      if(!$scope.product.rrp){
        $scope.product.rrp=0;
      }
      $scope.product.rrp=parseFloat($scope.product.rrp);
      $scope.product.rrp=$scope.product.rrp+change;
      if($scope.product.rrp<=0){
        $scope.product.rrp=0;
      }
    }
    $scope.changeMsp=function(change){
      if(!$scope.product.min_sale_price){
        $scope.product.min_sale_price=0;
      }
      $scope.product.min_sale_price=parseFloat($scope.product.min_sale_price);
      $scope.product.min_sale_price=$scope.product.min_sale_price+change;
      if($scope.product.min_sale_price<=0){
        $scope.product.min_sale_price=0;
      }
      else if($scope.product.min_sale_price>=$scope.product.rrp){
        $scope.product.min_sale_price=$scope.product.rrp;
      }
    }

    $scope.loadTags=function($query){
      var p=new Promise(
        function(resolve, reject){
          Tags.query(function(response){
            inittags=[];
            for(var i=0;i<response.length;i++){
              inittags.push(response[i].name);
            }
            resolve(inittags);
          });
        });
      p.then(function(ts){
        var tags=[];
        for(var i=0;i<ts.length;i++){
          if (ts[i].toLowerCase().indexOf($query.toLowerCase())>-1){
            tags.push(ts[i]);
          }
        }
        return tags;
      });
      return p
    };

    $scope.addTag=function($tag){
      var exist=false;
      for(var i=0;i<$scope.tags.length;i++){
        if($scope.tags[i].name==$tag){
          exist=true;
        }
      }
      if(!exist){
        Tags.save({"name":$tag},
          function(){
            $scope.tags=Tags.query();
          });
      }
    }

    $scope.selectedFiles = [];
    $scope.progress = [];
    $scope.dataUrls = [];
    $scope.onFileSelect = function($files) {
      for(var i=0;i<$files.length;i++){
        var file=$files[i];
        //console.log(file);
        if(window.FileReader && file.type.indexOf('image')>-1){
          var fileReader=new FileReader();
          fileReader.readAsDataURL(file);
            function setPreview(fileReader, file){
              fileReader.onload=function(e){
                $timeout(function(){
                  if($scope.dataUrls.indexOf(e.target.result)==-1){
                    //console.log(file);
                    $scope.selectedFiles.push(file);
                    $scope.dataUrls.push(e.target.result);
                  }
                });
              }
            }
        setPreview(fileReader,file);
        }
      }
    };

  $scope.imageDelete=function(url){
    var index=$scope.dataUrls.indexOf(url);
    $scope.dataUrls.splice(index,1);
    $scope.selectedFiles.splice(index,1);
  }

  $scope.finishedimage=0;
  $scope.detailprogress=[];
  $scope.saveProduct = function() {
    $scope.submit=true;
    $scope.progress=0;
    $scope.progresstext="Creating new product...";
    var step=parseInt(100/(1+$scope.selectedFiles.length));
    for(var i=0;i<$scope.tags.length;i++){
      var index=$scope.product.tag.indexOf($scope.tags[i].name);
      if(index>-1){
        $scope.product.tag[index]=$scope.tags[i].resource_uri;
      }
    }
    $scope.product.inventory_status=$scope.product.inventory_status.resource_uri;
    var newProduct=new Products($scope.product);
    newProduct.$save(newProduct,
      function(data){
        $scope.progress=$scope.progress+step;
        $scope.product=data;
        $scope.upload=[];
        $scope.progresstext="Uploading images...";
        if($scope.selectedFiles.length==0){
          $location.url('/product');
        }
        for(var i=0;i<$scope.selectedFiles.length;i++){
          $scope.start(i, step);
        }

      },
      function(response){
        $scope.submit=false;
        console.log(response);

      });
    
    };

  $scope.dupProduct = function() {
    $scope.submit=true;
    $scope.progress=0;
    $scope.progresstext="Creating new product...";
    var step=parseInt(100/(1+$scope.selectedFiles.length));
    for(var i=0;i<$scope.tags.length;i++){
      var index=$scope.product.tag.indexOf($scope.tags[i].name);
      if(index>-1){
        $scope.product.tag[index]=$scope.tags[i].resource_uri;
      }
    }
    $scope.product.inventory_status=$scope.product.inventory_status.resource_uri;
    var newProduct=new Products($scope.product);
    newProduct.$save(newProduct,
      function(data){
        $scope.progress=$scope.progress+step;
        $scope.product=data;
        $scope.upload=[];
        $scope.progresstext="Uploading images...";
        if($scope.selectedFiles.length==0){
          $location.url('/product-new/'+data.id);
        }
        for(var i=0;i<$scope.selectedFiles.length;i++){
          $scope.start(i, step);
        }

      },
      function(response){
        $scope.submit=false;
        console.log(response);

      });
    
    };

    $scope.start=function(index, step){
      $scope.detailprogress[index]=0;
      $upload.upload({
              url: "/api/v1/productimage/",
              method: "POST",
              data: {
                'owner': $scope.product.resource_uri,
              },
              file: $scope.selectedFiles[index],
              fileFormDataName: 'image',
            }).progress(function(evt) {
              $scope.detailprogress[index]=parseInt(step * evt.loaded / evt.total);
              $scope.progress=step;
              for(var j=0;j<$scope.detailprogress.length;j++){
                $scope.progress=$scope.progress+$scope.detailprogress[j];
              }
            }).success(function(data, status, headers, config) {
              // file is uploaded successfully

              $scope.finishedimage++;
              $scope.progresstext="Uploading images... ("+$scope.finishedimage+"/"+$scope.selectedFiles.length+" finished)";
              if($scope.finishedimage==$scope.selectedFiles.length){
                $scope.progress=100;
                $location.url('/product');
              }
              //console.log(data);
            }).error(function(data){
              $scope.submit=false;
              console.log(data);
            });
    };

  }]);

invenmgtControllers.controller('ProductNewDupCtrl', ['$scope', '$upload', '$routeParams','$timeout', '$location', 'Products', 'Employee', 'Tags', 'ProductStatus',
  function($scope, $upload, $routeParams, $timeout, $location, Products, Employee, Tags, ProductStatus){
    $scope.tags=Tags.query();

    $scope.product=Products.get({id:$routeParams.productID},
      function(response){
        delete response.id;
        delete response.resource_uri;
        delete response.image;
        response.min_sale_price=parseFloat(response.min_sale_price);
        response.rrp=parseFloat(response.rrp);
        for(var i=0;i<response.tag.length;i++){
          response.tag[i]=response.tag[i].name;
        }
        $scope.status=ProductStatus.query(function(response){
          for(var i=0;i<response.length;i++){
            if(response[i].id==$scope.product.inventory_status.id){
              $scope.product.inventory_status=response[i];
            }
          }
        });
      });
    $scope.submit=false;
    $scope.status=ProductStatus.query();

    //load current user
    $.ajax({ 
        url:'/api/v1/signup/login',
        method:'GET',
        success:function(response){
          $scope.currentuser = Employee.get({id:response.id});
        },
        error:function(response){
          console.log(response);
        },
      });

    $scope.images={};
    $scope.file={};
    $scope.changeInven=function(change){
      if(!$scope.product.inventory_free){
        $scope.product.inventory_free=0;
      }
      $scope.product.inventory_free=parseFloat($scope.product.inventory_free);
      $scope.product.inventory_free=$scope.product.inventory_free+change;
      if($scope.product.inventory_free<=0){
        $scope.product.inventory_free=0;
      }
    };
    $scope.changeAlertInven=function(change){
      if(!$scope.product.min_qty){
        $scope.product.min_qty=0;
      }
      $scope.product.min_qty=parseFloat($scope.product.min_qty);
      $scope.product.min_qty=$scope.product.min_qty+change;
      if($scope.product.min_qty<=0){
        $scope.product.min_qty=0;
      }
    };
    $scope.changeLeadtime=function(change){
      if(!$scope.product.leadtime){
        $scope.product.leadtime=0;
      }
      $scope.product.leadtime=parseFloat($scope.product.leadtime);
      $scope.product.leadtime=$scope.product.leadtime+change;
      if($scope.product.leadtime<=0){
        $scope.product.leadtime=0;
      }
    };
    $scope.changeRrp=function(change){
      if(!$scope.product.rrp){
        $scope.product.rrp=0;
      }
      $scope.product.rrp=parseFloat($scope.product.rrp);
      $scope.product.rrp=$scope.product.rrp+change;
      if($scope.product.rrp<=0){
        $scope.product.rrp=0;
      }
    }
    $scope.changeMsp=function(change){
      if(!$scope.product.min_sale_price){
        $scope.product.min_sale_price=0;
      }
      $scope.product.min_sale_price=parseFloat($scope.product.min_sale_price);
      $scope.product.min_sale_price=$scope.product.min_sale_price+change;
      if($scope.product.min_sale_price<=0){
        $scope.product.min_sale_price=0;
      }
      else if($scope.product.min_sale_price>=$scope.product.rrp){
        $scope.product.min_sale_price=$scope.product.rrp;
      }
    }

    $scope.loadTags=function($query){
      var p=new Promise(
        function(resolve, reject){
          Tags.query(function(response){
            inittags=[];
            for(var i=0;i<response.length;i++){
              inittags.push(response[i].name);
            }
            resolve(inittags);
          });
        });
      p.then(function(ts){
        var tags=[];
        for(var i=0;i<ts.length;i++){
          if (ts[i].toLowerCase().indexOf($query.toLowerCase())>-1){
            tags.push(ts[i]);
          }
        }
        return tags;
      });
      return p
    };

    $scope.addTag=function($tag){
      var exist=false;
      for(var i=0;i<$scope.tags.length;i++){
        if($scope.tags[i].name==$tag){
          exist=true;
        }
      }
      if(!exist){
        Tags.save({"name":$tag},
          function(){
            $scope.tags=Tags.query();
          });
      }
    }

    $scope.selectedFiles = [];
    $scope.progress = [];
    $scope.dataUrls = [];
    $scope.onFileSelect = function($files) {
      for(var i=0;i<$files.length;i++){
        var file=$files[i];
        //console.log(file);
        if(window.FileReader && file.type.indexOf('image')>-1){
          var fileReader=new FileReader();
          fileReader.readAsDataURL(file);
            function setPreview(fileReader, file){
              fileReader.onload=function(e){
                $timeout(function(){
                  if($scope.dataUrls.indexOf(e.target.result)==-1){
                    //console.log(file);
                    $scope.selectedFiles.push(file);
                    $scope.dataUrls.push(e.target.result);
                  }
                });
              }
            }
        setPreview(fileReader,file);
        }
      }
    };

  $scope.imageDelete=function(url){
    var index=$scope.dataUrls.indexOf(url);
    $scope.dataUrls.splice(index,1);
    $scope.selectedFiles.splice(index,1);
  }

  $scope.finishedimage=0;
  $scope.detailprogress=[];
  $scope.saveProduct = function() {
    $scope.submit=true;
    $scope.progress=0;
    $scope.progresstext="Creating new product...";
    var step=parseInt(100/(1+$scope.selectedFiles.length));
    for(var i=0;i<$scope.tags.length;i++){
      var index=$scope.product.tag.indexOf($scope.tags[i].name);
      if(index>-1){
        $scope.product.tag[index]=$scope.tags[i].resource_uri;
      }
    }
    $scope.product.inventory_status=$scope.product.inventory_status.resource_uri;
    Products.save($scope.product,
      function(data){
        $scope.progress=$scope.progress+step;
        $scope.product=data;
        $scope.upload=[];
        $scope.progresstext="Uploading images...";
        if($scope.selectedFiles.length==0){
          $location.url('/product');
        }
        for(var i=0;i<$scope.selectedFiles.length;i++){
          $scope.start(i, step);
        }

      },
      function(response){
        $scope.submit=false;
        console.log(response);

      });
    
    };
  $scope.dup=false;
  $scope.dupProduct = function() {
    $scope.dup=true;
    $scope.submit=true;
    $scope.progress=0;
    $scope.progresstext="Creating new product...";
    var step=parseInt(100/(1+$scope.selectedFiles.length));
    for(var i=0;i<$scope.tags.length;i++){
      var index=$scope.product.tag.indexOf($scope.tags[i].name);
      if(index>-1){
        $scope.product.tag[index]=$scope.tags[i].resource_uri;
      }
    }
    $scope.product.inventory_status=$scope.product.inventory_status.resource_uri;
    Products.save($scope.product,
      function(data){
        $scope.progress=$scope.progress+step;
        $scope.product=data;
        $scope.upload=[];
        $scope.progresstext="Uploading images...";
        if($scope.selectedFiles.length==0){
          var url="/product-new/"+data.id;
          $location.url(url);
        }
        for(var i=0;i<$scope.selectedFiles.length;i++){
          $scope.start(i, step);
        }

      },
      function(response){
        $scope.submit=false;
        console.log(response);

      });
    
    };

    $scope.start=function(index, step){
      $scope.detailprogress[index]=0;
      $upload.upload({
              url: "/api/v1/productimage/",
              method: "POST",
              data: {
                'owner': $scope.product.resource_uri,
              },
              file: $scope.selectedFiles[index],
              fileFormDataName: 'image',
            }).progress(function(evt) {
              $scope.detailprogress[index]=parseInt(step * evt.loaded / evt.total);
              $scope.progress=step;
              for(var j=0;j<$scope.detailprogress.length;j++){
                $scope.progress=$scope.progress+$scope.detailprogress[j];
              }
            }).success(function(data, status, headers, config) {
              // file is uploaded successfully

              $scope.finishedimage++;
              $scope.progresstext="Uploading images... ("+$scope.finishedimage+"/"+$scope.selectedFiles.length+" finished)";
              if($scope.finishedimage==$scope.selectedFiles.length){
                $scope.progress=100;
                if(!$scope.dup){
                  $location.url('/product');
                }else{
                  var url="/product-new/"+$scope.product.id;
                  $location.url(url);
                }
                
              }
              //console.log(data);
            }).error(function(data){
              $scope.submit=false;
              console.log(data);
            });
    };

  }]);

invenmgtControllers.controller('ProductEditCtrl', ['$scope', '$routeParams', '$upload', '$timeout', '$location', 'Products', 'Employee', 'Tags', 'ProductStatus', 'ProductImage',
  function($scope, $routeParams, $upload, $timeout, $location, Products, Employee, Tags, ProductStatus, ProductImage){
    $scope.tags=Tags.query();

    $scope.product=Products.get({id:$routeParams.productID},
      function(response){
        response.min_sale_price=parseFloat(response.min_sale_price);
        response.rrp=parseFloat(response.rrp);
        for(var i=0;i<response.tag.length;i++){
          response.tag[i]=response.tag[i].name;
        }
        $scope.status=ProductStatus.query(function(response){
          for(var i=0;i<response.length;i++){
            if(response[i].id==$scope.product.inventory_status.id){
              $scope.product.inventory_status=response[i];
            }
          }
        });
      });

    $scope.submit=false;

    //load current user
    $.ajax({ 
        url:'/api/v1/signup/login',
        method:'GET',
        success:function(response){
          $scope.currentuser = Employee.get({id:response.id});
        },
        error:function(response){
          console.log(response);
        },
      });

    $scope.changeInven=function(change){
      if(!$scope.product.inventory_free){
        $scope.product.inventory_free=0;
      }
      $scope.product.inventory_free=parseFloat($scope.product.inventory_free);
      $scope.product.inventory_free=$scope.product.inventory_free+change;
      if($scope.product.inventory_free<=0){
        $scope.product.inventory_free=0;
      }
    };

    $scope.changeAlertInven=function(change){
      if(!$scope.product.min_qty){
        $scope.product.min_qty=0;
      }
      $scope.product.min_qty=parseFloat($scope.product.min_qty);
      $scope.product.min_qty=$scope.product.min_qty+change;
      if($scope.product.min_qty<=0){
        $scope.product.min_qty=0;
      }
    };

    $scope.changeLeadtime=function(change){
      if(!$scope.product.leadtime){
        $scope.product.leadtime=0;
      }
      $scope.product.leadtime=parseFloat($scope.product.leadtime);
      $scope.product.leadtime=$scope.product.leadtime+change;
      if($scope.product.leadtime<=0){
        $scope.product.leadtime=0;
      }
    };

    $scope.changeRrp=function(change){
      if(!$scope.product.rrp){
        $scope.product.rrp=0;
      }
      $scope.product.rrp=parseFloat($scope.product.rrp);
      $scope.product.rrp=$scope.product.rrp+change;
      if($scope.product.rrp<=0){
        $scope.product.rrp=0;
      }
    };

    $scope.changeMsp=function(change){
      if(!$scope.product.min_sale_price){
        $scope.product.min_sale_price=0;
      }
      $scope.product.min_sale_price=parseFloat($scope.product.min_sale_price);
      $scope.product.min_sale_price=$scope.product.min_sale_price+change;
      if($scope.product.min_sale_price<=0){
        $scope.product.min_sale_price=0;
      }
      else if($scope.product.min_sale_price>=$scope.product.rrp){
        $scope.product.min_sale_price=$scope.product.rrp;
      }
    };

    $scope.loadTags=function($query){
      var p=new Promise(
        function(resolve, reject){
          Tags.query(function(response){
            inittags=[];
            for(var i=0;i<response.length;i++){
              inittags.push(response[i].name);
            }
            resolve(inittags);
          });
        });
      p.then(function(ts){
        var tags=[];
        for(var i=0;i<ts.length;i++){
          if (ts[i].toLowerCase().indexOf($query.toLowerCase())>-1){
            tags.push(ts[i]);
          }
        }
        return tags;
      });
      return p
    };

    $scope.addTag=function($tag){
      var exist=false;
      for(var i=0;i<$scope.tags.length;i++){
        if($scope.tags[i].name==$tag){
          exist=true;
        }
      }
      if(!exist){
        Tags.save({"name":$tag},
          function(){
            $scope.tags=Tags.query();
          });
      }
    };

    $scope.progress = [];
    $scope.upload=[];
    
    $scope.onFileSelect = function($files) {
      $scope.totalprogress=0;
      $scope.upload=$files;
      for(var i=0;i<$scope.upload.length;i++){
        $scope.start(i);
      }
    };

    $scope.start=function(index){
      $scope.progress[index]=0;
      $upload.upload({
              url: "/api/v1/productimage/",
              method: "POST",
              data: {
                'owner': $scope.product.resource_uri,
              },
              file: $scope.upload[index],
              fileFormDataName: 'image',
            }).progress(function(evt) {
              $scope.totalprogress=0;
              $scope.progress[index]=parseInt(100 * evt.loaded / evt.total/$scope.upload.length);
              for(var j=0;j<$scope.progress.length;j++){
                $scope.totalprogress=$scope.totalprogress+$scope.progress[j];
              }
            }).success(function(data, status, headers, config) {
              // file is uploaded successfully
              $scope.product.image.push(data);
              if(index+1==$scope.upload.length){
                $scope.totalprogress=100;
                $scope.upload=[];
              }
            }).error(function(data){
              $scope.submit=false;
              console.log(data);
            });
    };

    $scope.imageDelete=function(img){
      var aImg=new ProductImage(aImg);
      aImg.$delete({id:img.id}, function(){
        var index=$scope.product.image.indexOf(img);
        $scope.product.image.splice(index,1);
      });
    }

  $scope.finishedimage=0;
  $scope.saveProduct = function() {
    for(var i=0;i<$scope.tags.length;i++){
      var index=$scope.product.tag.indexOf($scope.tags[i].name);
      if(index>-1){
        $scope.product.tag[index]=$scope.tags[i].resource_uri;
      }
    }
    for(var i=0;i<$scope.product.image.length;i++){
      $scope.product.image[i]= $scope.product.image[i].resource_uri;
    }
    $scope.product.belong_to=$scope.product.belong_to.resource_uri;
    $scope.product.inventory_status=$scope.product.inventory_status.resource_uri;
    $scope.product.$update(function(data){
        $location.url('/product');
      },
      function(response){
        $scope.submit=false;
        console.log(response);

      });
    
    };

  }]);

//Inventory
invenmgtControllers.controller('PurchaseRecordCtrl', ['$scope', 'Products', 'Employee', 'Tags', 'PurchaseRecord', 'InstockRecord',
  function($scope, Products, Employee, Tags, PurchaseRecord, InstockRecord){
    $scope.tags=Tags.query(
      function(){
        for(var i=0;i<$scope.tags.length;i++){
          $scope.tags[i].checked=false;
        }
      });
    $scope.activenumber=0;
    $scope.outstocknumber=0;
    $scope.products=[];
    function loadproductrecords(limit, offset){
      var products=Products.query({'limit':limit, 'offset':offset},
        function(response){
          if(response.length!=0){
            loadproductrecords(limit, limit+offset);           
          }
          for(var i=0;i<products.length;i++){
            var index=i;
            products[i].instockrecord=[];
            products[i].purchaserecord=[];

            products[i].alert=[]
            if(products[i].inventory_free<=products[i].min_qty){
              products[i].alert=[{ type: 'danger', msg: 'Nearly out of stock!' },];
            }

            products[i].instockrecord=InstockRecord.query({'product__id': products[i].id, 'limit':5, 'order_by': '-id'}, function(){
              $('#cards').masonry();
            },function(response){
              $('#cards').masonry();
            });
            products[i].purchaserecord=PurchaseRecord.query({'product__id': products[i].id, 'limit':5, 'order_by': '-id'}, function(){
              $('#cards').masonry();
            },function(){
              $('#cards').masonry();
            });
            products[i].rrp=parseFloat(products[i].rrp);
            if(products[i].inventory_status.name=="Active"){
              $scope.activenumber++;
            }
            if(products[i].inventory_free<=products[i].min_qty&&products[i].inventory_status.name=="Active"){
              $scope.outstocknumber++;
              products[i].style={"background-color":"#F4A9BB","color":"#FFFFFF"};
            }
            else if(products[i].inventory_status.name=="Active"){
              products[i].style={"background-color":"#E1ECDE"};
            }
            $scope.products.push(products[i]);
          }
        });  
    }
    loadproductrecords(10, 0);

    $scope.closeAlert = function(product, index) {
        product.alert.splice(index, 1);
      };

    $scope.tags=Tags.query(
      function(){
        for(var i=0;i<$scope.tags.length;i++){
          $scope.tags[i].checked=false;
        }
      });
    $scope.tagfilter=function(product){
      for(var i=0;i<$scope.tags.length;i++){
        if($scope.tags[i].checked){
          var hastag=false;
          for(var j=0;j<product.tag.length;j++){
            if($scope.tags[i].id==product.tag[j].id){
              hastag=true;
            }
          }
          if(!hastag){
            return false;
          }
        }
      }
      return true;
    };
    $scope.selectedtag=function(id){
      for(var i=0;i<$scope.tags.length;i++){
        if($scope.tags[i].id==id){
          if($scope.tags[i].checked){
            $scope.tags[i].checked=false;
          }
          else{
            $scope.tags[i].checked=true;
          }
        }
      }
    };
    $scope.showinactive==false;
    $scope.clickshowinactive=function(){
      $scope.showinactive=!$scope.showinactive;
    }
    $scope.activefilter=function(product){
      if($scope.showinactive){
        return true;
      }
      else{
        return product.inventory_status.name=="Active";
      }   
    }
    $scope.showoutstock=false;
    $scope.outstockfilter=function(product){
      if(!$scope.showoutstock){
        return true;
      }
      return product.inventory_free<=product.min_qty;
    };
    $scope.clickshowoutstock=function(){
      $scope.showoutstock=!$scope.showoutstock;
    };
    $scope.orderbyoptions=[
      {'name':'create date: newest to oldest','orderBy':'-id'},
      {'name':'create date: oldest to newest','orderBy':'id'},
      {'name':'RRP: lowest to highest','orderBy':'rrp'},
      {'name':'RRP: highest to lowest','orderBy':'-rrp'},
      {'name':'name: A to Z','orderBy':'name'},
      {'name':'name: Z to A','orderBy':'-name'},
      {'name':'nearly out of stock first', 'orderBy':'inventory_free>min_qty'},
    ];
    $scope.cardview=true;
    $scope.listview=false;
    $scope.oldview=false;
    $scope.startcard=function(){
      $scope.cardview=true;
      $scope.listview=false;
    };
    $scope.startlist=function(){
      $scope.listview=true;
      $scope.cardview=false;
    };
  }]);

var NewCompanyCtrl = function($scope, $modalInstance, currency, Country, Companys, Address, SalesChannel){
    $scope.company={};
    SalesChannel.query({'channel_name':'Supplier'},function(response){
      $scope.company.sales_channel=response[0].resource_uri;
    });
    $scope.company.default_currency=currency.resource_uri;
    $scope.company.initial_creditAmount=999999;
    $scope.company.credit_currency=currency.resource_uri;

    $scope.address={};
    $scope.country=Country.query();
    $scope.submitted=false;
    $scope.save="Save";
    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
    $scope.ok = function () {
      $scope.submitted=true;
      $scope.save="Sending Info";
      Companys.save($scope.company,function(response){
        $scope.company=response;
        $scope.address.company=response.resource_uri;
        $scope.address.is_default=true;
        $scope.address.country=$scope.address.country.resource_uri;
        Address.save($scope.address,function(response){
          $modalInstance.close($scope.company);
        },function(response){
          $scope.submitted=false;
          $scope.save="Save";
          $scope.company.$delete();
          console.log(response);
        });
      },function(response){
        $scope.submitted=false;
        $scope.save="Save";
        console.log(response);
      });
    }
  };

invenmgtControllers.controller('PurchaseRecordDetailCtrl', ['$scope', '$location', '$routeParams', '$modal','Products', 'Employee', 'Companys', 'Address', 'Currency', 'PurchaseRecord', 'Country',
  function($scope, $location, $routeParams, $modal, Products, Employee, Companys, Address, Currency, PurchaseRecord, Country){
    $scope.purchaserecord={};
    if(typeof $routeParams.purchaseID!='undefined'){
      $scope.purchaserecord=PurchaseRecord.get({'id':$routeParams.purchaseID})
    }
    $scope.currency=Currency.query();
    $scope.product=Products.get({ id:$routeParams.productID },
      function(){
        $scope.purchaserecord.product=$scope.product.resource_uri;
        $scope.thumbnaillist=$scope.product.image.slice($scope.thumbnailnumber,$scope.thumbnailnumber+4);
        $scope.selectedimg=$scope.product.image[0];
      });
    $scope.thumbnailnumber=0;
    
    $scope.thumbnaildown=function(){
      if($scope.thumbnailnumber+4<=$scope.product.image.length){
        $scope.thumbnailnumber++;
        $scope.thumbnaillist.splice(0,1);
        $scope.thumbnaillist.push($scope.product.image[$scope.thumbnailnumber+3]);
      }
    };
    $scope.thumbnailup=function(){
      if($scope.thumbnailnumber>0){
        $scope.thumbnailnumber=$scope.thumbnailnumber-1;
        $scope.thumbnaillist.pop();
        $scope.thumbnaillist.splice(0,0,$scope.product.image[$scope.thumbnailnumber]);
      }
    };
    
    $scope.clickselectimg=function(image){
      $scope.selectedimg=image;
    };

    $scope.companys=Companys.query();

    $scope.open1 = function($event) {
      $event.preventDefault();
      $event.stopPropagation();
      $scope.opened2 = false;
      $scope.opened1 = true;
    };

    $scope.open2 = function($event) {
      $event.preventDefault();
      $event.stopPropagation();
      $scope.opened1 = false;
      $scope.opened2 = true;
    };

    $scope.dateOptions = {
      'year-format': "'yyyy'",
      'starting-day': 1
    };
    $scope.isCollapsed=true;
    $scope.selectcompany=function(c){
      c.address=Address.query({'company__id':c.id,});
      for(var i=0;i<$scope.currency.length;i++){
        if($scope.currency[i].id==c.default_currency.id){
          c.default_currency=$scope.currency[i];
        }
      }
      $scope.purchaserecord.purchase_currency=c.default_currency;
      $scope.isCollapsed=false;
    }
    $scope.alert="";
    $scope.closeAlert=function(){
      $scope.alert="";
    }
    $scope.save=function(){
      if(typeof $routeParams.purchaseID!='undefined'){
        $scope.purchaserecord.$update(
          function(){
            $location.url('/product-records/'+$scope.product.id);
          },function(){
            $scope.alert="Updatng record unsuccessful!";
          });
      }else{
        var r=$scope.purchaserecord;
        r.supplier=$scope.purchaserecord.supplier.resource_uri;
        r.purchase_currency=r.purchase_currency.resource_uri;
        PurchaseRecord.save(r,function(){
          $location.url('/purchase-list');
        },function(response){
          $scope.alert="Adding record unsuccessful!"
        });
      }
    };

    $scope.newsupplier = function () {
      var modalInstance = $modal.open({
        templateUrl: 'newsupplier.html',
        controller: NewCompanyCtrl,
        resolve: {
          currency: function(){
            return $scope.product.belong_to.default_currency;
          }
        }
      });

      modalInstance.result.then(function (company) {
        $scope.companys.push(company);
        $scope.purchaserecord.supplier=company;
        var cid=$scope.purchaserecord.supplier.id;
        $scope.purchaserecord.supplier.address=Address.query({'company__id':cid,});
        for(var i=0;i<$scope.currency.length;i++){
          if($scope.currency[i].id==$scope.purchaserecord.supplier.default_currency.id){
            $scope.purchaserecord.supplier.default_currency=$scope.currency[i];
          }
        }
        $scope.purchaserecord.purchase_currency=company.default_currency;
        $scope.isCollapsed=false;
      });
    };
    
  }]);

invenmgtControllers.controller('InstockRecordDetailCtrl', ['$scope', '$location', '$routeParams', '$modal','Products', 'Employee', 'Companys', 'Address', 'Currency', 'PurchaseRecord', 'Country', 'InstockRecord',
  function($scope, $location, $routeParams, $modal, Products, Employee, Companys, Address, Currency, PurchaseRecord, Country, InstockRecord){
    $scope.instockrecord={};
    $scope.addpurchaserecord=true;
    $scope.openpurchasewell=function(){
      $scope.addpurchaserecord=!$scope.addpurchaserecord;
    };

    $scope.purchaserecord={};
    $scope.currency=Currency.query();
    $scope.product=Products.get({ id:$routeParams.productID },
      function(){
        $scope.purchaserecords=PurchaseRecord.query({'product__id':$scope.product.id}, function(){
          for(var i=0;i<$scope.purchaserecords.length;i++){
            $scope.purchaserecords[i].max=$scope.purchaserecords[i].purchase_qty;
            if(typeof $routeParams.purchaseID!='undefined'&&$scope.purchaserecords[i].id==$routeParams.purchaseID){
              $scope.instockrecord.purchase_record=$scope.purchaserecords[i];
              $scope.instockrecord.purchase_record.max=$routeParams.max;
            }           
          }    
          InstockRecord.query({'product__id':$scope.product.id},function(response){
            var pl=angular.copy($scope.purchaserecords);
            for(var i=0;i<response.length;i++){
              for(var j=0;j<pl.length;j++){             
                if(typeof $routeParams.purchaseID!='undefined'){
                  if(pl[j].id==response[i].purchase_record.id&&pl[j].id!=$routeParams.purchaseID){
                    $scope.purchaserecords.splice(j,1);
                  }
                }else{
                  if(pl[j].id==response[i].purchase_record.id&&pl[j].id!=$routeParams.purchaseID){
                    $scope.purchaserecords.splice(j,1);
                  }                  
                }
              }
              pl=angular.copy($scope.purchaserecords);
            }
          });
        });
        $scope.purchaserecord.product=$scope.product.resource_uri;
        $scope.thumbnaillist=$scope.product.image.slice($scope.thumbnailnumber,$scope.thumbnailnumber+4);
        $scope.selectedimg=$scope.product.image[0];
      });

    $scope.showall=function(){
      $scope.purchaserecords=PurchaseRecord.query({'product__id':$scope.product.id},function(response){
        for (var i=0;i<response.length;i++){
          var index=i;
          var calleft=function(index){
            var irs=InstockRecord.query({'purchase_record__id':$scope.purchaserecords[index].id}, function(){
              var count=0;
              for(var j=0;j<irs.length;j++){
                count=count+irs[j].initial_instock_qty;
              }
              $scope.purchaserecords[index].max=$scope.purchaserecords[index].purchase_qty-count;
              if(typeof $routeParams.purchaseID!='undefined'&&$scope.purchaserecords[index].id==$routeParams.purchaseID){
                $scope.instockrecord.purchase_record=$scope.purchaserecords[index];
                $scope.instockrecord.purchase_record.max=$routeParams.max;
              } 
            })
          };
          calleft(index);
        }
      });
    };

    $scope.thumbnailnumber=0;
    
    $scope.selectpr=function(pr){
      if(!$scope.instockrecord.purchase_record){
        $scope.instockrecord.purchase_record=pr;
      }else if($scope.instockrecord.purchase_record.id!=pr.id){
        $scope.instockrecord.purchase_record=pr;
      }
      else{
        $scope.instockrecord.purchase_record="";
      }
    }

    $scope.thumbnaildown=function(){
      if($scope.thumbnailnumber+4<=$scope.product.image.length){
        $scope.thumbnailnumber++;
        $scope.thumbnaillist.splice(0,1);
        $scope.thumbnaillist.push($scope.product.image[$scope.thumbnailnumber+3]);
      }
    };
    $scope.thumbnailup=function(){
      if($scope.thumbnailnumber>0){
        $scope.thumbnailnumber=$scope.thumbnailnumber-1;
        $scope.thumbnaillist.pop();
        $scope.thumbnaillist.splice(0,0,$scope.product.image[$scope.thumbnailnumber]);
      }
    };
    
    $scope.clickselectimg=function(image){
      $scope.selectedimg=image;
    };

    $scope.companys=Companys.query();

    $scope.open1 = function($event) {
      $event.preventDefault();
      $event.stopPropagation();
      $scope.opened3 = false;
      $scope.opened2 = false;
      $scope.opened1 = true;
    };

    $scope.open2 = function($event) {
      $event.preventDefault();
      $event.stopPropagation();
      $scope.opened3 = false;
      $scope.opened1 = false;
      $scope.opened2 = true;
    };

    $scope.open3 = function($event) {
      $event.preventDefault();
      $event.stopPropagation();
      $scope.opened3 = true;
      $scope.opened1 = false;
      $scope.opened2 = false;
    };

    $scope.dateOptions = {
      'year-format': "'yyyy'",
      'starting-day': 1
    };
    $scope.isCollapsed=true;
    $scope.selectcompany=function(c){
      c.address=Address.query({'company__id':c.id,});
      for(var i=0;i<$scope.currency.length;i++){
        if($scope.currency[i].id==c.default_currency.id){
          c.default_currency=$scope.currency[i];
        }
      }
      $scope.purchaserecord.purchase_currency=c.default_currency;
      $scope.isCollapsed=false;
    }
    $scope.alert="";
    $scope.closeAlert=function(){
      $scope.alert="";
    }
    $scope.save=function(){
      var r=$scope.purchaserecord;
      r.supplier=$scope.purchaserecord.supplier.resource_uri;
      r.purchase_currency=r.purchase_currency.resource_uri;
      PurchaseRecord.save(r,function(response){
        $scope.purchaserecord=PurchaseRecord.get({'id':response.id},function(response){
          $scope.purchaserecords.push(response);
          $scope.instockrecord.purchase_record=response;
          $scope.instockrecord.purchase_record.max=$scope.instockrecord.purchase_record.purchase_qty;
          $scope.addpurchaserecord=true;
        });
      },function(response){
        $scope.alert="Adding record unsuccessful!"
      });
    };
    $scope.cancel=function(){
      $scope.addpurchaserecord=true;
    };

    $scope.newsupplier = function () {
      var modalInstance = $modal.open({
        templateUrl: 'newsupplier.html',
        controller: NewCompanyCtrl,
        resolve: {
          currency: function(){
            return $scope.product.belong_to.default_currency;
          }
        }
      });

      modalInstance.result.then(function (company) {
        $scope.companys.push(company);
        $scope.purchaserecord.supplier=company;
        var cid=$scope.purchaserecord.supplier.id;
        $scope.purchaserecord.supplier.address=Address.query({'company__id':cid,});
        for(var i=0;i<$scope.currency.length;i++){
          if($scope.currency[i].id==$scope.purchaserecord.supplier.default_currency.id){
            $scope.purchaserecord.supplier.default_currency=$scope.currency[i];
          }
        }
        $scope.purchaserecord.purchase_currency=company.default_currency;
        $scope.isCollapsed=false;
      });
    };

    $scope.instocksavetext="Save";
    $scope.sendinginstockdata=false;
    $scope.instocksave=function(){
      $scope.instocksavetext="Sending data...";
      $scope.sendinginstockdata=true;
      $scope.instockrecord.product=$scope.product.resource_uri;
      if(typeof $scope.instockrecord.purchase_record!="undefined"){
        $scope.instockrecord.purchase_record=$scope.instockrecord.purchase_record.resource_uri;
      }
      InstockRecord.save($scope.instockrecord, function(){
        $location.url("/purchase-list")
      }, function(response){
        $scope.instocksavetext="Save";
        $scope.sendinginstockdata=false;
        console.log(response);
      });
    };
    $scope.instockcancel=function(){
      $location.url('/purchase-list');
    };
    
  }]);

invenmgtControllers.controller('ProductRecordsListCtrl', ['$scope', '$location', '$routeParams', 'Products', 'PurchaseRecord', 'InstockRecord',
  function($scope, $location, $routeParams, Products, PurchaseRecord, InstockRecord){
    $scope.records=[];

    $scope.product=Products.get({ 'id':$routeParams.productID },function(response){
      var purchaserecord=PurchaseRecord.query({'product__id':response.id, 'limit':0, "order_by":'-purchase_date'},function(){
        var instockrecord=InstockRecord.query({'product__id':$scope.product.id, 'limit':0, "order_by":'-instock_date'},function(){
          for(var i=0;i<purchaserecord.length;i++){
            var r={};
            var irs=[];
            for(var j=0;j<instockrecord.length;j++){
              if(instockrecord[j].purchase_record==null){
                var r_nopur={};
                r_nopur.inventoryrecords=[];
                r_nopur.inventoryrecords[0]=instockrecord[j];
                r_nopur.purchaserecord=null;
                r_nopur.count=instockrecord[j].initial_instock_qty;
                if(i==0){
                  $scope.records.push(r_nopur);
                }
              }else if(instockrecord[j].purchase_record.id==purchaserecord[i].id){
                irs.push(instockrecord[j]);
              }
            }
            r.purchaserecord=purchaserecord[i];
            r.inventoryrecords=[];
            r.inventoryrecords=irs;
            var count=0;
            for(var j=0;j<r.inventoryrecords.length;j++){
              count=count+r.inventoryrecords[j].initial_instock_qty;
            }
            r.count=count;
            $scope.records.push(r);
          }
        },function(){
          for(var i=0;i<purchaserecord.length;i++){
            var r={};
            var irs=[];
            r.purchaserecord=purchaserecord[i];
            r.inventoryrecords=[];
            r.inventoryrecords=irs;
            var count=0;
            for(var j=0;j<r.inventoryrecords.length;j++){
              count=count+r.inventoryrecords[j].initial_instock_qty;
            }
            r.count=count;
            $scope.records.push(r);
          }
        });
      },function(){
        var instockrecord=InstockRecord.query({'product__id':$scope.product.id, 'limit':0,},function(){
            for(var j=0;j<instockrecord.length;j++){
              if(instockrecord[j].purchase_record==null){
                var r_nopur={};
                r_nopur.inventoryrecords=[];
                r_nopur.inventoryrecords[0]=instockrecord[j];
                r_nopur.purchaserecord=null;
                var count=0;
                r_nopur.count=instockrecord[j].initial_instock_qty;
                $scope.records.push(r_nopur);
              }
            }
        });
      });
    });
    
    $scope.orderbyoptions=[
      {'name':'purchase date: newest to oldest','orderBy':'-purchaserecord.purchase_date'},
      {'name':'purchase date: oldest to newest','orderBy':'purchaserecord.purchase_date'},
      {'name':'instock date: newest to oldest','orderBy':'-inventoryrecords[0].instock_date'},
      {'name':'instock date: oldest to newest','orderBy':'inventoryrecords[0].instock_date'},
      {'name':'purchase quantity: largest to smallest','orderBy':'-purchaserecord.purchase_qty'},
      {'name':'purchase quantity: smallest to largest','orderBy':'purchaserecord.purchase_qty'},
      {'name':'purchase price: lowest to highest','orderBy':'-purchaserecord.purchase_price'},
      {'name':'purchase price: highest to lowest','orderBy':'purchaserecord.purchase_price'},
      {'name':'supplier: A to Z','orderBy':'purchaserecord.supplier.name'},
      {'name':'supplier: Z to A','orderBy':'-purchaserecord.supplier.name'},
    ];

    $scope.iwop=false;
    $scope.iwopclick=function(){
      $scope.iwop=!$scope.iwop;
    };
    $scope.iwopfilter=function(r){
      if($scope.iwop){
        if(r.purchaserecord==null){
          return true;
        }else{
          return false;
        }
      }else{
        return true;
      }
    };

    $scope.pwoi=false;
    $scope.pwoiclick=function(){
      $scope.pwoi=!$scope.pwoi;
    }
    $scope.pwoifilter=function(r){
      if($scope.pwoi){
        if(r.inventoryrecords.length==0){
          return true;
        }else{
          return false;
        }
      }else{
        return true;
      }
    };

    $scope.pwi=false;
    $scope.pwiclick=function(){
      $scope.pwi=!$scope.pwi;
    }
    $scope.pwifilter=function(r){
      if($scope.pwi){
        if(r.inventoryrecords.length!=0&&r.purchaserecord!=null){
          return true;
        }else{
          return false;
        }
      }else{
        return true;
      }
    };

    $scope.wd=false;
    $scope.wdclick=function(){
      $scope.wd=!$scope.wd;
    }
    $scope.wdfilter=function(r){
      if($scope.wd){
        if(r.count<r.purchaserecord.purchase_qty){
          return true;
        }else{
          return false;
        }
      }else{
        return true;
      }
    };

  }]);

//Customer
var NewCustomerCtrl = function($scope, $modalInstance, currency, Country, Companys, Address, SalesChannel){
    $scope.company={};
    $scope.channel=[];
    SalesChannel.query(function(response){
      for(var i=0;i<response.length;i++){
        if(response[i].channel_name!="Supplier"&&response[i].channel_name!="Paid Client"){
          $scope.channel.push(response[i]);
        }
      }
    });
    $scope.company.default_currency=currency.resource_uri;
    $scope.company.credit_currency=currency.resource_uri;

    $scope.address={};
    $scope.country=Country.query();
    $scope.submitted=false;
    $scope.save="Save";
    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
    $scope.ok = function () {
      $scope.submitted=true;
      $scope.save="Sending Info";
      $scope.company.sales_channel=$scope.company.sales_channel.resource_uri;
      Companys.save($scope.company,function(response){
        $scope.company=response;
        $scope.address.company=response.resource_uri;
        $scope.address.is_default=true;
        $scope.address.country=$scope.address.country.resource_uri;
        Address.save($scope.address,function(response){
          $modalInstance.close($scope.company);
        },function(response){
          $scope.submitted=false;
          $scope.save="Save";
          $scope.company.$delete();
          console.log(response);
        });
      },function(response){
        $scope.submitted=false;
        $scope.save="Save";
        console.log(response);
      });
    }
  };

var AddressAddCtrl = function($scope, $modalInstance, company, Country, Address, SalesChannel){

    $scope.address={};
    $scope.address.is_default=false;
    $scope.address.company=company.resource_uri;
    $scope.country=Country.query();
    $scope.submitted=false;
    $scope.save="Save";
    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
    $scope.ok = function () {
      $scope.submitted=true;
      $scope.save="Sending Info";
      $scope.address.country=$scope.address.country.resource_uri;
      Address.save($scope.address,function(response){
        $modalInstance.close(response);
      },function(response){
        $scope.submitted=false;
        $scope.save="Save";
        console.log(response);
      });
    };
  };

var AddressEditCtrl = function($scope, $modalInstance, address, Country, Address, SalesChannel){

    $scope.address=address;
    $scope.address.company=$scope.address.company.resource_uri;
    $scope.country=Country.query();
    $scope.submitted=false;
    $scope.save="Save";
    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
    $scope.ok = function () {
      $scope.submitted=true;
      $scope.save="Sending Info";
      $scope.address.country=$scope.address.country.resource_uri;
      $scope.address.$update(function(response){
        $modalInstance.close(response);
      },function(response){
        $scope.submitted=false;
        $scope.save="Save";
        console.log(response);
      });
    };
  };

var EditCustomerCtrl = function($scope, $modalInstance, company, Companys, SalesChannel){
    $scope.company=company;
    $scope.company.credit_amount=parseInt($scope.company.credit_amount);
    $scope.company.initial_creditAmount=parseInt($scope.company.initial_creditAmount);
    console.log(company);
    $scope.channel=[];
    SalesChannel.query(function(response){
      for(var i=0;i<response.length;i++){
        if(response[i].channel_name!="Supplier"&&response[i].channel_name!="Paid Client"){
          if(response[i].id==company.sales_channel.id){
            $scope.company.sales_channel=response[i];
          }
          $scope.channel.push(response[i]);
        }
      }
    });

    $scope.submitted=false;
    $scope.save="Save";
    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
    $scope.ok = function () {
      $scope.submitted=true;
      $scope.save="Sending Info";
      $scope.company.sales_channel=$scope.company.sales_channel.resource_uri;
      $scope.company.$update(function(response){
        $modalInstance.close(response);
      },function(response){
        $scope.submitted=false;
        $scope.save="Save";
        console.log(response);
      });
    }
  };

invenmgtControllers.controller('CustomerCtrl',['$scope', '$modal', '$timeout', 'Companys', 'Address', 
  function($scope, $modal, $timeout, Companys, Address){
    $scope.companys=Companys.query(function(){
      for(var i=0;i<$scope.companys.length;i++){
        if($scope.companys[i].is_paid_client){
          $scope.owner=$scope.companys[i];
        }
        $scope.companys[i].address=Address.query({'company__id':$scope.companys[i].id}, function(){
          $timeout(function(){
            $("#cards").masonry();
          },200);
        }, function(){
          $timeout(function(){
            $("#cards").masonry();
          },200);
        });
      }
      $("#cards").masonry();
    });
    $scope.ownersupplierfilter=function(company){
      if(company.is_paid_client){
        return false;
      }else if(company.sales_channel.channel_name=='Supplier'){
        return false;
      }else{
        return true;
      }
    }
    $scope.orderbyoptions=[
      {'name':'create date: newest to oldest','orderBy':'-id'},
      {'name':'create date: oldest to newest','orderBy':'id'},
      {'name':'name: A-Z','orderBy':'name'},
      {'name':'name: Z-A','orderBy':'-name'},
    ];

    $scope.newcustomer = function () {
      var modalInstance = $modal.open({
        templateUrl: 'newcustomer.html',
        controller: NewCustomerCtrl,
        resolve: {
          currency: function(){
            return $scope.owner.default_currency;
          }
        }
      });

      modalInstance.result.then(function (company) {
        var newcustomer=Companys.get({'id':company.id},function(){
          newcustomer.address=Address.query({'company__id':newcustomer.id});
          $scope.companys.push(newcustomer);
          $("#cards").masonry();
        });
      });
    };

    $scope.addressadd = function (company) {
      var modalInstance = $modal.open({
        templateUrl: 'addressedit.html',
        controller: AddressAddCtrl,
        resolve: {
          company: function(){
            return company;
          }
        }
      });

      modalInstance.result.then(function (address) {
        company.address=Address.query({'company__id':company.id},function(){
          $("#cards").masonry();
        });    
      });
    };

    $scope.addressedit = function (address,company) {
      var modalInstance = $modal.open({
        templateUrl: 'addressedit.html',
        controller: AddressEditCtrl,
        resolve: {
          address: function(){
            return address;
          }
        }
      });

      modalInstance.result.then(function (address) {
        company.address=Address.query({'company__id':company.id},function(){
          $timeout(function(){
            $("#cards").masonry()
          },500);
        });    
      });
    };

    $scope.addressdel = function (address,company) {
      address.$delete(function(){
        company.address=Address.query({'company__id':company.id},function(){
          $("#cards").masonry();
        });
      });
    };

    $scope.customeredit = function (company) {
      var modalInstance = $modal.open({
        templateUrl: 'editcustomer.html',
        controller: EditCustomerCtrl,
        resolve: {
          company: function(){
            return company;
          }
        }
      });

      modalInstance.result.then(function (c) {
        company=c;
      });
    };

  }]);

//Order
var AddOrderRecordCtrl = function($scope, $modalInstance, product, record){
  $scope.showproductinfo=true;
  $scope.record = record;
  $scope.product=product;
  $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
    $scope.submitted=false;
    $scope.save="Save";
    $scope.ok = function () {
      $scope.submitted=true;
      $scope.save="Sending Info";
      $scope.record.product=product;
      $scope.record.unitprice=($scope.record.product.rrp*$scope.record.discount_percentage/100).toFixed(2);
      $scope.record.ttlprice=($scope.record.unitprice*$scope.record.quantity).toFixed(2);
      $modalInstance.close($scope.record);
    };
};

invenmgtControllers.controller('OrderNewCtrl', ['$route','$location', '$scope', '$http', '$timeout', '$modal', 'Employee','Companys', 'Address', 'Products', 'Tags', 'Orders', 'OrderStatus', 'OrderRecords', 'RecordStatus',
  function($route, $location, $scope,$http, $timeout, $modal, Employee, Companys,Address, Products, Tags,  Orders, OrderStatus, OrderRecords, RecordStatus){
    $scope.order={};
    $scope.customers=Companys.query(function(response){
      for(var i=0;i<response.length;i++){
        $scope.customers[i].address=Address.query({"company__id":response[i].id},function(response){
          for(var j=0;j<response.length;j++){
              if(!response[j].is_default){
                response[j].selected=false;
              }else{
                response[j].selected=true;
              }
            }
        });
        if(response[i].is_paid_client){
          $scope.default_currency=response[i].default_currency;
        }
      }
    });
    $http.get('/api/v1/signup/login').success(function(response){
      $scope.currentuser=Employee.get({'id':response.id});
    });
    $scope.orderstatus=OrderStatus.query({'name':'pending'});
    $scope.recordstatus=RecordStatus.query({'name':'pending'});
    $scope.orderformcollapse=false;
    $scope.confirmorderinfo=function(){
      $scope.orderformcollapse=!$scope.orderformcollapse;
      $timeout(function(){
        $("#cards").masonry();
      },500);
    }
    $scope.isCollapsed=true;
    $scope.dateOptions = {
      'year-format': "'yyyy'",
      'starting-day': 1
    };
    $scope.selectcustomer=function(){
      $scope.isCollapsed=false;
      for(var i=0;i<$scope.order.customer.address.length;i++){
        if($scope.order.customer.address[i].is_default){
          $scope.order.delivery_address=$scope.order.customer.address[i];
        }
      }
    }
    $scope.open = function($event) {
      $event.preventDefault();
      $event.stopPropagation();
      $scope.opened = true;
    };
    $scope.newcustomer = function () {
      var modalInstance = $modal.open({
        templateUrl: 'newcustomer.html',
        controller: NewCustomerCtrl,
        resolve: {
          currency: function(){
            return $scope.default_currency;
          }
        }
      });
      modalInstance.result.then(function (company) {
        var newcustomer=Companys.get({'id':company.id},function(){
          newcustomer.address=Address.query({'company__id':newcustomer.id},function(response){
            for(var i=0;i<response.length;i++){
              if(!response[i].is_default){
                response[i].selected=false;
              }else{
                $scope.order.delivery_address=response[i];
                response[i].selected=true;
              }
            }
          });
          $scope.customers.push(newcustomer);
          $scope.order.customer=newcustomer;
          $scope.order.delivery_address=newcustomer.address[0];
          $scope.isCollapsed=false;
        });
      });
    };
    $scope.seladd=function(a){
      $scope.order.delivery_address=a;
      for(var i=0;i<$scope.order.customer.address.length;i++){
        $scope.order.customer.address[i].selected=false;
      }
      a.selected=true;
    };
    $scope.addressadd = function (company) {
      var modalInstance = $modal.open({
        templateUrl: 'addressedit.html',
        controller: AddressAddCtrl,
        resolve: {
          company: function(){
            return company;
          }
        }
      });

      modalInstance.result.then(function (address) {
        address.selected=true;
        for(var i=0;i<$scope.order.customer.address.length;i++){
          $scope.order.customer.address[i].selected=false;
        }
        $scope.order.delivery_address=address;
        company.address.push(address);    
      });
    };

    //orderrecord
    $scope.showdeleteicon=false;
    $scope.totalmoney=0;
    $scope.finishselectproduct=false;
    $scope.recordsproducts=[];
    $scope.orderrecords=[];
    $scope.delrecord=function(record){
      var index=$scope.orderrecords.indexOf(record);
      $scope.recordsproducts.splice(index,1);
      $scope.orderrecords.splice(index,1);
      if($scope.orderrecords.length==0){
        $scope.finishselectproduct=false;
      }
    };
    $scope.clickfinishselect=function(){
      $scope.totalmoney=0;
      $scope.orderformcollapse=true;
      $scope.finishselectproduct=!$scope.finishselectproduct;
      for(var i=0;i<$scope.orderrecords.length;i++){
        $scope.totalmoney=$scope.totalmoney+$scope.orderrecords[i].product.rrp*$scope.orderrecords[i].discount_percentage/100*$scope.orderrecords[i].quantity;
      }
      $scope.totalmoney=$scope.totalmoney.toFixed(2);
    };

    $scope.selectproduct=function(product){
      var record={};
      if($scope.products.length==0||$scope.recordsproducts.indexOf(product)==-1){
        var modalInstance = $modal.open({
          templateUrl: 'orderrecord.html',
          controller: AddOrderRecordCtrl,
          resolve: {
            product: function(){
              product.inventory_free=parseFloat(product.inventory_free);
              return product;
            },
            record: function(){
              return record;
            }
          }
        });
        modalInstance.result.then(function (record) {
          $scope.recordsproducts.push(record.product);
          $scope.orderrecords.push(record);
        });
      }else if($scope.recordsproducts.indexOf(product)>-1){
        var index=$scope.recordsproducts.indexOf(product);
        var modalInstance = $modal.open({
          templateUrl: 'orderrecord.html',
          controller: AddOrderRecordCtrl,
          resolve: {
            product: function(){
              return product;
            },
            record: function(){
              return $scope.orderrecords[index];
            }
          }
        });
        modalInstance.result.then(function (record) {
          $scope.orderrecords[index]=record;   
        });
      }
    }

    //products
    $scope.activenumber=0;
    $scope.outstocknumber=0;
    $scope.products=[];
    function loadproductrecords(limit, offset){
      var products=Products.query({'limit':limit, 'offset':offset, 'order_by': '-id'},
        function(response){
          if(response.length!=0){
            loadproductrecords(limit, limit+offset);
          }

          for(var i=0;i<products.length;i++){
            var index=i;
            products[i].rrp=parseFloat(products[i].rrp);
            if(products[i].inventory_status.name=="Active"){
              $scope.activenumber++;
            }
            if(products[i].inventory_free<=products[i].min_qty&&products[i].inventory_status.name=="Active"){
              $scope.outstocknumber++;
              products[i].style={"background-color":"#F4A9BB","color":"#FFFFFF"};
            }
            else if(products[i].inventory_status.name=="Active"){
              products[i].style={"background-color":"#E1ECDE"};
            }
            $scope.products.push(products[i]);
          }       
        });  
    }
    loadproductrecords(20, 0);
    $scope.tags=Tags.query(
      function(){
        for(var i=0;i<$scope.tags.length;i++){
          $scope.tags[i].checked=false;
        }
      });
    $scope.tagfilter=function(product){
      for(var i=0;i<$scope.tags.length;i++){
        if($scope.tags[i].checked){
          var hastag=false;
          for(var j=0;j<product.tag.length;j++){
            if($scope.tags[i].id==product.tag[j].id){
              hastag=true;
            }
          }
          if(!hastag){
            return false;
          }
        }
      }
      return true;
    };
    $scope.selectedtag=function(id){
      for(var i=0;i<$scope.tags.length;i++){
        if($scope.tags[i].id==id){
          if($scope.tags[i].checked){
            $scope.tags[i].checked=false;
          }
          else{
            $scope.tags[i].checked=true;
          }
        }
      }
    };
    $scope.showinactive==false;
    $scope.clickshowinactive=function(){
      $scope.showinactive=!$scope.showinactive;
    }
    $scope.activefilter=function(product){
      if($scope.showinactive){
        return true;
      }
      else{
        return product.inventory_status.name=="Active";
      }   
    }
    $scope.showoutstock=false;
    $scope.outstockfilter=function(product){
      if(!$scope.showoutstock){
        return true;
      }
      return product.inventory_free<=product.min_qty;
    };
    $scope.clickshowoutstock=function(){
      $scope.showoutstock=!$scope.showoutstock;
    };
    $scope.orderbyoptions=[
      {'name':'create date: newest to oldest','orderBy':'-id'},
      {'name':'create date: oldest to newest','orderBy':'id'},
      {'name':'RRP: lowest to highest','orderBy':'rrp'},
      {'name':'RRP: highest to lowest','orderBy':'-rrp'},
      {'name':'name: A to Z','orderBy':'name'},
      {'name':'name: Z to A','orderBy':'-name'},
      {'name':'nearly out of stock first', 'orderBy':'inventory_free>min_qty'},
    ];
    $scope.cardview=true;
    $scope.listview=false;
    $scope.oldview=false;
    $scope.startcard=function(){
      $scope.cardview=true;
      $scope.listview=false;
    };
    $scope.startlist=function(){
      $scope.listview=true;
      $scope.cardview=false;
    };

    //save order
    $scope.savestatus="Save";
    $scope.saveandnewstatus="Save & New";
    $scope.disablebuttons=false;

    $scope.saveorderandnew=function(){
      $scope.disablebuttons=true;
      var sendstatus=[];
      for(var i=0;i<$scope.orderrecords.length;i++){
        sendstatus.push[false];
        $scope.orderrecords[i].sendingid=i;
      }
      $scope.saveandnewstatus="Sending Order Data...";
      var order=angular.copy($scope.order);
      order.customer=order.customer.resource_uri;
      order.sales=$scope.currentuser.resource_uri;
      order.delivery_address=order.delivery_address.resource_uri;
      order.status=$scope.orderstatus[0].resource_uri;
      Orders.save(order, function(response){
        var orderid=response.resource_uri;
        for(var i=0;i<$scope.orderrecords.length;i++){
          var record=angular.copy($scope.orderrecords[i]);
          record.product=record.product.resource_uri+"/";
          record.status=$scope.recordstatus[0].resource_uri;
          record.owner=orderid+"/";
          OrderRecords.save(record, function(response){
            sendstatus[response.sendingid]=true;
            var testfinish=true;
            for(var j=0;j<sendstatus[j];j++){
              testfinish=testfinish*sendstatus[j];
            }
            if(testfinish){
              $route.reload();
            }
          },function(response){
            $scope.disablebuttons=false;
            console.log(response);
          });
        }
      },function(response){
        console.log(response);
      })
    };

    $scope.saveorder=function(){
      $scope.disablebuttons=true;
      var sendstatus=[];
      for(var i=0;i<$scope.orderrecords.length;i++){
        sendstatus.push[false];
        $scope.orderrecords[i].sendingid=i;
      }
      $scope.savestatus="Sending Order Data...";
      var order=angular.copy($scope.order);
      order.customer=order.customer.resource_uri;
      order.sales=$scope.currentuser.resource_uri;
      order.delivery_address=order.delivery_address.resource_uri;
      order.status=$scope.orderstatus[0].resource_uri;
      Orders.save(order, function(response){
        var orderid=response.resource_uri;
        for(var i=0;i<$scope.orderrecords.length;i++){
          var record=angular.copy($scope.orderrecords[i]);
          record.product=record.product.resource_uri+"/";
          record.status=$scope.recordstatus[0].resource_uri;
          record.owner=orderid+"/";
          OrderRecords.save(record, function(response){
            sendstatus[response.sendingid]=true;
            var testfinish=true;
            for(var j=0;j<sendstatus[j];j++){
              testfinish=testfinish*sendstatus[j];
            }
            if(testfinish){
              $location.url("/order");
            }
          },function(response){
            $scope.disablebuttons=false;
            console.log(response);
          });
        }
      },function(response){
        console.log(response);
      })
    };

  }]);

invenmgtControllers.controller('OrderListCtrl', ['$scope', '$http', '$location', 'Orders', 'OrderRecords', 'Employee',
  function($scope, $http, $location, Orders, OrderRecords, Employee){
    $http.get('/api/v1/signup/login').success(function(response){
      $scope.currentuser=Employee.get({'id':response.id},function(){
        $scope.isAdmin=($scope.currentuser.employee_role.role=='admin');
        $scope.isMgr=($scope.currentuser.employee_role.role=='mgr');
        $scope.isSales=($scope.currentuser.employee_role.role=='sales');
        $scope.isInvenmgr=($scope.currentuser.employee_role.role=='invenmgr');
        $scope.isAccount=($scope.currentuser.employee_role.role=='account');
      });
    });
    $scope.goorderdetail=function(id){
      $location.url("/order/"+id);
    }
    $scope.loading=true;
    $scope.orders=[];
    function loadorder(limit, offset){
      $http.get("/api/v1/order/?limit="+limit+"&offset="+offset+"&order_by=-id").success(function(response){
        for(var i=0;i<response.objects.length;i++){
          response.objects[i].total_price=parseFloat(response.objects[i].total_price).toFixed(2);
          response.objects[i].total_price=parseFloat(response.objects[i].total_price)
          var d=new Date(response.objects[i].date);
          response.objects[i].date=d;
          if(response.objects[i].status.name=="pending"){
            response.objects[i].statusvalue=20;
            response.objects[i].statustype="primary";
          }else if(response.objects[i].status.name=="picking up"){
            response.objects[i].statusvalue=40;
            response.objects[i].statustype="info"
          }else if(response.objects[i].status.name=="ready to ship"){
            response.objects[i].statusvalue=60;
            response.objects[i].statustype="info";
          }else if(response.objects[i].status.name=="shipped"){
            response.objects[i].statusvalue=80;
            response.objects[i].statustype="success";
          }else if(response.objects[i].status.name=="completed"){
            response.objects[i].statusvalue=100;
            response.objects[i].statustype="success";
          }
          $scope.orders.push(response.objects[i]);
        }
        if(response.meta.next){
          loadorder(limit, offset+limit);
        }else{
          $scope.loading=false;
        }
      });
    }
    loadorder(5,0);
    /*
    $scope.orders=Orders.query({'limit':0}, function(response){
      $scope.loading=false;
      for(var i=0;i<response.length;i++){
        response[i].total_price=parseFloat(response[i].total_price).toFixed(2);
        response[i].total_price=parseFloat(response[i].total_price)
        var d=new Date(response[i].date);
        response[i].date=d;
        if(response[i].status.name=="pending"){
          response[i].statusvalue=20;
          response[i].statustype="primary";
        }else if(response[i].status.name=="picking up"){
          response[i].statusvalue=40;
          response[i].statustype="info"
        }else if(response[i].status.name=="ready to ship"){
          response[i].statusvalue=60;
          response[i].statustype="info";
        }else if(response[i].status.name=="shipped"){
          response[i].statusvalue=80;
          response[i].statustype="success";
        }else if(response[i].status.name=="completed"){
          response[i].statusvalue=100;
          response[i].statustype="success";
        }
      }
    });
    */
    $scope.searchtext="";
    $scope.searchnum=0;
    $scope.searchbytext="All Fields";
    //1: Product
    //2: Customer
    //3: ID
    //0: ALL
    $scope.triggersearch=function(num){
      $scope.searchnum=num;
      if(num==0){
        $scope.searchbytext="All Fields";
      }else if(num==1){
        $scope.searchbytext="Product";
      }else if(num==2){
        $scope.searchbytext="Customer";
      }else if(num==3){
        $scope.searchbytext="Order ID";
      }
    };

    $scope.filtercancelled=function(record){
      if(record.status.name=="cancel"){
        return false;
      }
      return true;
    }

    $scope.filterowner=function(order){
      if(order.sales.id==$scope.currentuser.id||$scope.currentuser.employee_role.role=="admin"||$scope.currentuser.employee_role.role=="mgr"||$scope.currentuser.employee_role.role=="account"){
        return true;
      }
      return false;
    }

    $scope.searchfunc=function(order){
      if($scope.searchnum==0){
        if(JSON.stringify(order).indexOf($scope.searchtext)>-1){
          return true;
        }
      }else if($scope.searchnum==1){
        for(var i=0;i<order.records.length;i++){
          if(order.records[i].product.name.toLowerCase().indexOf($scope.searchtext)>-1){
            return true;
          }
        }
      }else if($scope.searchnum==2){
        if(order.customer.name.toLowerCase().indexOf($scope.searchtext.toLowerCase())>-1){
          return true;
        }
      }else if($scope.searchnum==3){
        if(order.uuid.toLowerCase().indexOf($scope.searchtext.toLowerCase())>-1){
          return true;
        }
      }
      return false;
    }

    $scope.orderbyoptions=[
      {'name':'create date: newest to oldest','orderBy':'-id'},
      {'name':'create date: oldest to newest','orderBy':'id'},
      {'name':'customer name: A to Z','orderBy':'customer.name'},
      {'name':'customer name: Z to A','orderBy':'-customer.name'},
      {'name':'Total Amount: largest to smallest','orderBy':'-total_price'},
      {'name':'Total Amount: smallest to largest','orderBy':'total_price'},
    ];
  }]);

invenmgtControllers.controller('OrderDetailCtrl', ['$window', '$routeParams','$route','$location', '$scope', '$http', '$timeout', '$modal', 'Employee','Companys', 'Address', 'Products', 'Tags', 'Orders', 'OrderStatus', 'OrderRecords', 'RecordStatus', 'Invoice', 'PaymentMethod',
  function($window, $routeParams, $route, $location, $scope,$http, $timeout, $modal, Employee, Companys,Address, Products, Tags,  Orders, OrderStatus, OrderRecords, RecordStatus, Invoice, PaymentMethod){
    $scope.loading=true;
    $scope.recordsproducts=[];
    $scope.recordsproductsincludecancelled=[];
    $scope.order=Orders.get({'id':$routeParams.orderID}, function(response){
      response.date=new Date(response.date);
      if(response.status.name=="pending"){
        response.statusvalue=20;
        response.statustype="primary";
      }else if(response.status.name=="picking up"){
        response.statusvalue=40;
        response.statustype="info"
      }else if(response.status.name=="ready to ship"){
        response.statusvalue=60;
        response.statustype="info";
      }else if(response.status.name=="shipped"){
        response.statusvalue=80;
        response.statustype="success";
      }else if(response.status.name=="completed"){
        response.statusvalue=100;
        response.statustype="success";
      }
      if(response.status.name=="ready to ship"){
        response.orderstatustext="Click to confirm the order has been shipped.";
      }else if(response.status.name=="shipped"){
        response.orderstatustext="Click to confirm the order has been completed.";
      }
      response.total_price=parseFloat(parseFloat(response.total_price).toFixed(2));
      response.customer.address=Address.query({'company__id':response.customer.id},function(response){
        for(var i=0;i<response.length;i++){
          if(response[i].id==$scope.order.delivery_address.id){
            response[i].selected=true;
          }
          else{
            response[i].selected=false;
          }
        }
      });
      for(var i=0;i<response.records.length;i++){
        $scope.recordsproductsincludecancelled.push(response.records[i].product);
        response.records[i].unitprice=(response.records[i].product.rrp*response.records[i].discount_percentage/100).toFixed(2);
        response.records[i].ttlprice=(response.records[i].unitprice*response.records[i].quantity).toFixed(2);
        if(response.records[i].status.name!="cancel"){
          $scope.recordsproducts.push(response.records[i].product.id);
        }
        if(response.records[i].status.name=="pending"){
          response.records[i].statuschangetext="Click to confirm that we have enough inventory to fullfil the order.";
        }else if(response.records[i].status.name=="confirmed"){
          response.records[i].statuschangetext="Click to confirm that requested product have been picked up.";
        }
      }
      $scope.invoice={};
      $scope.invoice.payment_status=false;
      $scope.invoice.order=$scope.order.resource_uri;
      $scope.loading=false;
    });

    $scope.customers=Companys.query(function(response){
      for(var i=0;i<response.length;i++){
        $scope.customers[i].address=Address.query({"company__id":response[i].id},function(response){
          for(var j=0;j<response.length;j++){
              if(!response[j].is_default){
                response[j].selected=false;
              }else{
                response[j].selected=true;
              }
            }
        });
        if(response[i].is_paid_client){
          $scope.default_currency=response[i].default_currency;
        }
      }
    });
    $http.get('/api/v1/signup/login').success(function(response){
      $scope.currentuser=Employee.get({'id':response.id});
    });
    $scope.orderstatus=OrderStatus.query();
    $scope.recordstatus=RecordStatus.query();
    $scope.orderformcollapse=true;
    $scope.confirmorderinfo=function(){
      if(!$scope.orderformcollapse){
        var order=angular.copy($scope.order);
        for(var i=0;i<order.records.length;i++){
          order.records[i]=order.records[i].resource_uri;
        }
        order.customer=order.customer.resource_uri;
        order.delivery_address=order.delivery_address.resource_uri;
        order.sales=order.sales.resource_uri;
        order.status=order.status.resource_uri;
        order.$update(function(){
          $scope.orderformcollapse=!$scope.orderformcollapse;
        },function(response){
          console.log(response);
        });
      }else{
        $scope.orderformcollapse=!$scope.orderformcollapse;
      }
      $timeout(function(){
        $("#cards").masonry();
      },500);
    }
    $scope.isCollapsed=false;
    $scope.dateOptions = {
      'year-format': "'yyyy'",
      'starting-day': 1
    };
    $scope.selectcustomer=function(){
      $scope.isCollapsed=false;
      for(var i=0;i<$scope.order.customer.address.length;i++){
        if($scope.order.customer.address[i].is_default){
          $scope.order.delivery_address=$scope.order.customer.address[i];
        }
      }
    }
    $scope.open = function($event) {
      $event.preventDefault();
      $event.stopPropagation();
      $scope.opened = true;
    };
    $scope.newcustomer = function () {
      var modalInstance = $modal.open({
        templateUrl: 'newcustomer.html',
        controller: NewCustomerCtrl,
        resolve: {
          currency: function(){
            return $scope.default_currency;
          }
        }
      });
      modalInstance.result.then(function (company) {
        var newcustomer=Companys.get({'id':company.id},function(){
          newcustomer.address=Address.query({'company__id':newcustomer.id},function(response){
            for(var i=0;i<response.length;i++){
              if(!response[i].is_default){
                response[i].selected=false;
              }else{
                $scope.order.delivery_address=response[i];
                response[i].selected=true;
              }
            }
          });
          $scope.customers.push(newcustomer);
          $scope.order.customer=newcustomer;
          $scope.order.delivery_address=newcustomer.address[0];
          $scope.isCollapsed=false;
        });
      });
    };
    $scope.seladd=function(a){
      $scope.order.delivery_address=a;
      for(var i=0;i<$scope.order.customer.address.length;i++){
        $scope.order.customer.address[i].selected=false;
      }
      a.selected=true;
    };
    $scope.addressadd = function (company) {
      var modalInstance = $modal.open({
        templateUrl: 'addressedit.html',
        controller: AddressAddCtrl,
        resolve: {
          company: function(){
            return company;
          }
        }
      });

      modalInstance.result.then(function (address) {
        address.selected=true;
        for(var i=0;i<$scope.order.customer.address.length;i++){
          $scope.order.customer.address[i].selected=false;
        }
        $scope.order.delivery_address=address;
        company.address.push(address);    
      });
    };
    $scope.changingorderstatus=false;
    $scope.changeorderstatus=function(){
      $scope.changingorderstatus=true;
      var shipped={};
      var completed={};
      for(var i=0;i<$scope.orderstatus.length;i++){
        if($scope.orderstatus[i].name=="shipped"){
          shipped=$scope.orderstatus[i];
        }else if($scope.orderstatus[i].name=="completed"){
          completed=$scope.orderstatus[i];
        }
      }
      var order=angular.copy($scope.order);
      for(var i=0;i<order.records.length;i++){
        order.records[i]=order.records[i].resource_uri;
      }
      order.customer=order.customer.resource_uri;
      order.delivery_address=order.delivery_address.resource_uri;
      order.sales=order.sales.resource_uri;
      if(order.status.name=="ready to ship"){
        order.status=shipped.resource_uri;
      }else if(order.status.name=="shipped"){
        order.status=completed.resource_uri;
      }
      order.$update(function(){
        Orders.get({'id':order.id}, function(response){
          if(response.status.name=="pending"){
            response.statusvalue=20;
            response.statustype="primary";
          }else if(response.status.name=="picking up"){
            response.statusvalue=40;
            response.statustype="info"
          }else if(response.status.name=="ready to ship"){
            response.statusvalue=60;
            response.statustype="info";
          }else if(response.status.name=="shipped"){
            response.statusvalue=80;
            response.statustype="success";
          }else if(response.status.name=="completed"){
            response.statusvalue=100;
            response.statustype="success";
          }
          if(response.status.name=="ready to ship"){
            response.orderstatustext="Click to confirm the order has been shipped.";
          }else if(response.status.name=="shipped"){
            response.orderstatustext="Click to confirm the order has been completed.";
          }
          $scope.order.statusvalue=response.statusvalue;
          $scope.order.statustype=response.statustype;
          $scope.order.status=response.status;
          $scope.order.orderstatustext=response.orderstatustext;
          $scope.changingorderstatus=false;
        });
      }, function(response){
        console.log(response);
      });
    }

    //orderrecord
    $scope.mouseoncard=true;
    $scope.mouseoverrecord=function(){
      $timeout(function(){
        $("#records").masonry();
      },100);
    };
    $scope.movecanceltoend=function(r){
      return r.status.name=='cancel';
    };
    $scope.disablechangestatus=false;
    $scope.changestatus=function(change_r){
      $scope.disablechangestatus=true;
      var r=angular.copy(change_r);
      change_r.statuschangetext="Please wait.";
      var index=$scope.order.records.indexOf(change_r);
      var status_con={};
      var status_pick={};
      for(var i=0;i<$scope.recordstatus.length;i++){
        if($scope.recordstatus[i].name=="confirmed"){
          status_con=$scope.recordstatus[i];
        }else if($scope.recordstatus[i].name=="picked up"){
          status_pick=$scope.recordstatus[i];
        }
      }
      if(r.status.name=="pending"){
        r.status=status_con;
      }else if(r.status.name=="confirmed"){
        r.status=status_pick;
      }
      r.product=r.product.resource_uri;
      r.status=r.status.resource_uri;
      OrderRecords.update(r, function(){
        r=OrderRecords.get({'id':r.id},function(response){
          if(response.status.name=="pending"){
            response.statuschangetext="Click to confirm that we have enough inventory to fullfil the order.";
          }else if(response.status.name=="confirmed"){
            response.statuschangetext="Click to confirm that requested product have been picked up.";
          }
          $scope.order.records[index].status=response.status;
          $scope.order.records[index].statuschangetext=response.statuschangetext;
          $scope.disablechangestatus=false;
        });
        Orders.get({'id':$scope.order.id},function(response){
          if(response.status.name=="pending"){
            response.statusvalue=20;
            response.statustype="primary";
          }else if(response.status.name=="picking up"){
            response.statusvalue=40;
            response.statustype="info"
          }else if(response.status.name=="ready to ship"){
            response.statusvalue=60;
            response.statustype="info";
          }else if(response.status.name=="shipped"){
            response.statusvalue=80;
            response.statustype="success";
          }else if(response.status.name=="completed"){
            response.statusvalue=100;
            response.statustype="success";
          }
          if(response.status.name=="ready to ship"){
            response.orderstatustext="Click to confirm the order has been shipped.";
          }else if(response.status.name=="shipped"){
            response.orderstatustext="Click to confirm the order has been completed.";
          }
          $scope.order.statusvalue=response.statusvalue;
          $scope.order.statustype=response.statustype;
          $scope.order.status=response.status;
          $scope.order.orderstatustext=response.orderstatustext;
        });
      },function(response){
        console.log(response);
      });
    }
    $scope.showdeleteicon=false;
    $scope.totalmoney=0;
    $scope.finishselectproduct=true;
    $scope.delrecord=function(record){
      var index=$scope.order.records.indexOf(record);

      record.product=record.product.resource_uri;
      for(var i=0;i<$scope.recordstatus.length;i++){
        if($scope.recordstatus[i].name=="cancel"){
          console.log($scope.recordstatus[i].name);
          record.status=$scope.recordstatus[i].resource_uri;
        }
        console.log($scope.recordstatus[i].name);
      }
      OrderRecords.update(record, function(response){
        response.unitprice=(response.product.rrp*response.discount_percentage/100).toFixed(2);
        response.ttlprice=(response.unitprice*response.quantity).toFixed(2);
        $scope.order.records[index]=response;
        calttlprice();   
      },function(response){
        console.log(response);
      });

      $scope.recordsproducts.splice(index,1);
    };
    $scope.clickfinishselect=function(){
      $scope.order.total_price=0;
      $scope.orderformcollapse=true;
      $scope.finishselectproduct=!$scope.finishselectproduct;
      for(var i=0;i<$scope.order.records.length;i++){
        $scope.order.total_price=$scope.order.total_price+$scope.order.records[i].product.rrp*$scope.order.records[i].discount_percentage/100*$scope.order.records[i].quantity;
      }
      $scope.order.total_price=$scope.order.total_price.toFixed(2);
    };

    var calttlprice=function(){
      $scope.order.total_price=0;
      for(var i=0;i<$scope.order.records.length;i++){
        $scope.order.total_price=$scope.order.total_price+$scope.order.records[i].product.rrp*$scope.order.records[i].discount_percentage/100*$scope.order.records[i].quantity;
      }
      $scope.order.total_price=$scope.order.total_price.toFixed(2);
    };
    $scope.selectproduct=function(product, status){
      if(status!="cancel"&&$scope.order.status.name!="shipped"&&$scope.order.status.name!="completed"){
        var record={};
        if($scope.order.records.length==0||$scope.recordsproducts.indexOf(product.id)==-1){
          var modalInstance = $modal.open({
            templateUrl: 'orderrecord.html',
            controller: AddOrderRecordCtrl,
            resolve: {
              product: function(){
                product.inventory_free=parseFloat(product.inventory_free);
                return product;
              },
              record: function(){
                return record;
              }
            }
          });
          modalInstance.result.then(function (record) {
            record.product=record.product.resource_uri+"/";
            record.status=$scope.recordstatus[0].resource_uri;
            record.owner=$scope.order.resource_uri+"/";
            OrderRecords.save(record, function(response){
              if(response.status.name=="pending"){
                response.statuschangetext="Click to confirm that we have enough inventory to fullfil the order.";
              }else if(response.status.name=="confirmed"){
                response.statuschangetext="Click to confirm that requested product have been picked up.";
              }
              $scope.recordsproducts.push(response.product.id);
              $scope.recordsproductsincludecancelled.push(response.product);
              $scope.order.records.push(response);
            },function(response){
              console.log(response);
            });
          });
        }else if($scope.recordsproducts.indexOf(product.id)>-1){
          var index=$scope.recordsproductsincludecancelled.indexOf(product);
          if(index==-1){
            for(var i=0;i<$scope.order.records.length;i++){
              if($scope.order.records[i].product.id==product.id&&$scope.order.records[i].status.name!="cancel"){
                index=i;
              }
            }
          }
          var modalInstance = $modal.open({
            templateUrl: 'orderrecord.html',
            controller: AddOrderRecordCtrl,
            resolve: {
              product: function(){
                return product;
              },
              record: function(){
                $scope.order.records[index].discount_percentage=parseInt($scope.order.records[index].discount_percentage);
                return $scope.order.records[index];
              }
            }
          });
          modalInstance.result.then(function (record) {
            record.product=record.product.resource_uri;
            record.status=record.status.resource_uri;
            OrderRecords.update(record, function(response){
              if(response.status.name=="pending"){
                response.statuschangetext="Click to confirm that we have enough inventory to fullfil the order.";
              }else if(response.status.name=="confirmed"){
                response.statuschangetext="Click to confirm that requested product have been picked up.";
              }
              response.unitprice=(response.product.rrp*response.discount_percentage/100).toFixed(2);
              response.ttlprice=(response.unitprice*response.quantity).toFixed(2);
              response.$$hashKey=$scope.order.records[index].$$hashKey;
              $scope.order.records[index]=response;
              calttlprice();
              Orders.get({'id':$scope.order.id},function(response){
                if(response.status.name=="pending"){
                  response.statusvalue=20;
                  response.statustype="primary";
                }else if(response.status.name=="picking up"){
                  response.statusvalue=40;
                  response.statustype="info"
                }else if(response.status.name=="ready to ship"){
                  response.statusvalue=60;
                  response.statustype="info";
                }else if(response.status.name=="shipped"){
                  response.statusvalue=80;
                  response.statustype="success";
                }else if(response.status.name=="completed"){
                  response.statusvalue=100;
                  response.statustype="success";
                }
                if(response.status.name=="ready to ship"){
                  response.orderstatustext="Click to confirm the order has been shipped.";
                }else if(response.status.name=="shipped"){
                  response.orderstatustext="Click to confirm the order has been completed.";
                }
                $scope.order.statusvalue=response.statusvalue;
                $scope.order.statustype=response.statustype;
                $scope.order.status=response.status;
                $scope.order.orderstatustext=response.orderstatustext;
              });   
            },function(response){
              console.log(response);
            });
          });
        }
      }
    }

    //products
    $scope.activenumber=0;
    $scope.outstocknumber=0;
    $scope.products=Products.query({"limit":0},
      function(){
        for(var i=0;i<$scope.products.length;i++){
          $scope.products[i].rrp=parseFloat($scope.products[i].rrp);
          if($scope.products[i].inventory_status.name=="Active"){
            $scope.activenumber++;
          }
          if($scope.products[i].inventory_free<=$scope.products[i].min_qty&&$scope.products[i].inventory_status.name=="Active"){
            $scope.outstocknumber++;
            $scope.products[i].style={"background-color":"#F4A9BB","color":"#FFFFFF"};
          }
          else if($scope.products[i].inventory_status.name=="Active"){
            $scope.products[i].style={"background-color":"#E1ECDE"};
          }
        }
      });
    $scope.tags=Tags.query(
      function(){
        for(var i=0;i<$scope.tags.length;i++){
          $scope.tags[i].checked=false;
        }
      });
    $scope.tagfilter=function(product){
      for(var i=0;i<$scope.tags.length;i++){
        if($scope.tags[i].checked){
          var hastag=false;
          for(var j=0;j<product.tag.length;j++){
            if($scope.tags[i].id==product.tag[j].id){
              hastag=true;
            }
          }
          if(!hastag){
            return false;
          }
        }
      }
      return true;
    };
    $scope.selectedtag=function(id){
      for(var i=0;i<$scope.tags.length;i++){
        if($scope.tags[i].id==id){
          if($scope.tags[i].checked){
            $scope.tags[i].checked=false;
          }
          else{
            $scope.tags[i].checked=true;
          }
        }
      }
    };
    $scope.showinactive==false;
    $scope.clickshowinactive=function(){
      $scope.showinactive=!$scope.showinactive;
    }
    $scope.activefilter=function(product){
      if($scope.showinactive){
        return true;
      }
      else{
        return product.inventory_status.name=="Active";
      }   
    }
    $scope.showoutstock=false;
    $scope.outstockfilter=function(product){
      if(!$scope.showoutstock){
        return true;
      }
      return product.inventory_free<=product.min_qty;
    };
    $scope.clickshowoutstock=function(){
      $scope.showoutstock=!$scope.showoutstock;
    };
    $scope.orderbyoptions=[
      {'name':'create date: newest to oldest','orderBy':'-id'},
      {'name':'create date: oldest to newest','orderBy':'id'},
      {'name':'RRP: lowest to highest','orderBy':'rrp'},
      {'name':'RRP: highest to lowest','orderBy':'-rrp'},
      {'name':'name: A to Z','orderBy':'name'},
      {'name':'name: Z to A','orderBy':'-name'},
      {'name':'nearly out of stock first', 'orderBy':'inventory_free>min_qty'},
    ];
    $scope.cardview=true;
    $scope.listview=false;
    $scope.oldview=false;
    $scope.startcard=function(){
      $scope.cardview=true;
      $scope.listview=false;
    };
    $scope.startlist=function(){
      $scope.listview=true;
      $scope.cardview=false;
    };

    //invoice
    $scope.paymentmethod=PaymentMethod.query();
    $scope.selectinvoiceaddress=function(address){
      $scope.invoice.invoice_address=address;
    };
    $scope.invoiceaddressadd = function (company) {
      var modalInstance = $modal.open({
        templateUrl: 'addressedit.html',
        controller: AddressAddCtrl,
        resolve: {
          company: function(){
            return company;
          }
        }
      });

      modalInstance.result.then(function (address) {
        address.selected=false;
        $scope.invoice.invoice_address=address;
        company.address.push(address);    
      });
    };
    $scope.addinvoice=true;
    $scope.showinvoiceform=function(){
      if(!$scope.addinvoice){
        $scope.savinginvoicefinish=$scope.addinvoice;
      }
      $scope.addinvoice=!$scope.addinvoice;
      for(var i=0;i<$scope.order.customer.address.length;i++){
        if($scope.order.customer.address[i].id==$scope.order.delivery_address.id){
          $scope.invoice.invoice_address=$scope.order.customer.address[i];
        }
      }
    };
    $scope.savinginvoice=false;
    $scope.historicalinvoice=Invoice.query({'limit':1, 'order_by':'-id', 'order__id':$routeParams.orderID,}, function(response){
      $scope.historicalinvoice=response[0];
      $scope.historicalinvoice.total_price=parseFloat($scope.historicalinvoice.total_price);
      $scope.historicalinvoice.VAT_rate=parseFloat($scope.historicalinvoice.VAT_rate);
      $scope.historicalinvoice.totalincvat=($scope.historicalinvoice.total_price*($scope.historicalinvoice.VAT_rate+100)/100).toFixed(2);
    });
    $scope.savinginvoicefinish=false;
    $scope.saveinvoice=function(){
      $scope.invoice.tax_date=new Date();
      $scope.savinginvoice=true;
      $scope.invoice.total_price=$scope.order.total_price;
      var invoice=angular.copy($scope.invoice);
      if(typeof invoice.payment_method!="undefined"){
        invoice.payment_method=invoice.payment_method.resource_uri;
      }
      invoice.invoice_address=invoice.invoice_address.resource_uri;
      Invoice.save(invoice, function(response){
        $scope.historicalinvoice=response;
        $scope.historicalinvoice.total_price=parseFloat($scope.historicalinvoice.total_price);
        $scope.historicalinvoice.VAT_rate=parseFloat($scope.historicalinvoice.VAT_rate);
        $scope.historicalinvoice.totalincvat=($scope.historicalinvoice.total_price*($scope.historicalinvoice.VAT_rate+100)/100).toFixed(2);
        $scope.savinginvoice=false;
        $scope.savinginvoicefinish=true;
      }, function(response){
        console.log(response);
      });
    }
    $scope.receivepayment=function(){
      var invoice=angular.copy($scope.historicalinvoice);
      invoice.payment_status=true;
      invoice.payment_method=invoice.payment_method.resource_uri;
      invoice.invoice_address=invoice.invoice_address.resource_uri;
      invoice.$update(function(){
        $scope.historicalinvoice.payment_status=true;
      },function(response){
        console.log(response);
      })
    }
  }]);

//home
invenmgtControllers.controller('HomeCtrl', ['$q', '$scope', '$http', '$filter', '$location', '$timeout', 'Employee', 'Orders', 'OrderRecords', 'PurchaseRecord', 'InstockRecord', 'localStorageService', 'Products',
  function($q, $scope, $http, $filter, $location, $timeout, Employee, Orders, OrderRecords, PurchaseRecord, InstockRecord, localStorageService, Products){
    //localStorageService.clearAll();
    $http.get('/api/v1/signup/login').success(function(response){
      $scope.currentuser=Employee.get({'id':response.id},function(){
        $scope.isAdmin=($scope.currentuser.employee_role.role=='admin');
        $scope.isMgr=($scope.currentuser.employee_role.role=='mgr');
        $scope.isSales=($scope.currentuser.employee_role.role=='sales');
        $scope.isInvenmgr=($scope.currentuser.employee_role.role=='invenmgr');
        $scope.isAccount=($scope.currentuser.employee_role.role=='account');
        if(!$scope.isAdmin&&!$scope.isMgr){
          angular.element(".admin").remove();
        }
        if($scope.isMgr){
          $location.url('/statistics');
        }
        loadorder(5,0);
        backgroudloadorder(5);
      });
    });

    function backgroudloadorder(limit){
      $timeout(function(){
        loadorder(limit,0);
        loadpurchaserecord(10, 0);
        backgroudloadorder(limit);
      },60000)
    };

    $scope.orderids=(localStorageService.get('HomeCtrl_orderids'))?(localStorageService.get('HomeCtrl_orderids')):[];
    $scope.orders=(localStorageService.get('HomeCtrl_orders'))?(localStorageService.get('HomeCtrl_orders')):[];
    for(var i=0;i<$scope.orders.length;i++){
      $scope.orders[i].date=new Date($scope.orders[i].date);
    }
    $scope.products=(localStorageService.get('HomeCtrl_products'))?(localStorageService.get('HomeCtrl_products')):[];
    $scope.topproducts=$scope.products.slice(0,6);
    $scope.pickuprecords=(localStorageService.get('HomeCtrl_pickuprecords'))?(localStorageService.get('HomeCtrl_pickuprecords')):[];
    $scope.productids=[];

    $scope.filterorder=function(order){
      if(order.sales.id==$scope.currentuser.id||$scope.currentuser.employee_role.role=="admin"||$scope.currentuser.employee_role.role=="mgr"||$scope.currentuser.employee_role.role=="account"){
        if(order.status.name=="completed"){
          return false;
        }else{
          return true;
        }
      }
      return false;
    };

    $scope.viewproduct=function(id){
      $location.url('/product/'+id);
    };

    $scope.goorderdetail=function(id){
      $location.url("/order/"+id);
    };

    $scope.pickuprecordsfilter=function(p){
      return function(record){
        return record.product.id==p.id;
      }
    };

    $scope.changeconfirmedstatus=function(r){
      var record=angular.copy(r);
      r.changing=true;
      record.product=record.product.resource_uri;
      record.status="/api/v1/recordstatus/2";
      OrderRecords.update(record, function(response){
        r.status=response.status;
        r.changing=false;
      })
    };

    $scope.changepickupstatus=function(r){
      var record=angular.copy(r);
       r.changing=true;
      record.product=record.product.resource_uri;
      record.status="/api/v1/recordstatus/3";
      OrderRecords.update(record, function(response){
        r.status=response.status;
        r.changing=false;
      })
    };

    function loadorder(limit, offset){
      var finish=false;

      $http.get("/api/v1/order/?limit="+limit+"&offset="+offset+"&order_by=-id").success(function(response){
        for(var i=0;i<response.objects.length;i++){
          response.objects[i].total_price=parseFloat(response.objects[i].total_price).toFixed(2);
          response.objects[i].total_price=parseFloat(response.objects[i].total_price)
          var d=new Date(response.objects[i].date);
          response.objects[i].date=d;
          if(response.objects[i].status.name=="pending"){
            response.objects[i].statusvalue=20;
            response.objects[i].statustype="primary";
          }else if(response.objects[i].status.name=="picking up"){
            response.objects[i].statusvalue=40;
            response.objects[i].statustype="info"
          }else if(response.objects[i].status.name=="ready to ship"){
            response.objects[i].statusvalue=60;
            response.objects[i].statustype="info";
          }else if(response.objects[i].status.name=="shipped"){
            response.objects[i].statusvalue=80;
            response.objects[i].statustype="success";
          }else if(response.objects[i].status.name=="completed"){
            response.objects[i].statusvalue=100;
            response.objects[i].statustype="success";
          }
          var index=$scope.orderids.indexOf(response.objects[i].id);
          if(index==-1){
            $scope.firstload=true;
            $scope.orderids.push(response.objects[i].id);
            $scope.orders.push(response.objects[i]);
          }else{
            $scope.firstload=false;
            response.objects[i].$$hashKey=$scope.orders[index].$$hashKey;
            for(var n=0;n<response.objects[i].records.length;n++){
              for(var m=0;m<$scope.orders[index].records.length;m++){
                if($scope.orders[index].records[m].id==response.objects[i].records[n].id){
                  response.objects[i].records[n].$$hashKey=$scope.orders[index].records[m].$$hashKey;
                }
              }
            }
            $scope.orders[index]=response.objects[i];
          }
        }
        $scope.pickuprecords=[];
        for(var i=0;i<$scope.orders.length;i++){
          for(var j=0;j<$scope.orders[i].records.length;j++){
            var r=$scope.orders[i].records[j];
            var index=$scope.productids.indexOf(r.product.id);
            if(index>-1){
              updateproduct($scope.products[index]);
            }
            if(index>-1&&$scope.orders[i].sales.id==$scope.currentuser.id&&$scope.firstload){
              $scope.products[index].count=$scope.products[index].count+1;
            }else if(index>-1&&$scope.orders[i].sales.id!=$scope.currentuser.id&&$scope.firstload){
              $scope.products[index].count=$scope.products[index].count+0.1;
            }else if($scope.orders[i].sales.id==$scope.currentuser.id&&$scope.firstload){
              r.product.count=1;
              $scope.products.push(r.product);
              $scope.productids.push(r.product.id);
            }else if($scope.firstload){
              r.product.count=0.1;
              $scope.products.push(r.product);
              $scope.productids.push(r.product.id);
            }
            if((r.status.name=="pending"||r.status.name=="confirmed")&&$scope.pickuprecords.indexOf(r)==-1){
              r.customer=$scope.orders[i].customer.name;
              r.uuid=$scope.orders[i].uuid;
              r.date=$scope.orders[i].date;
              $scope.pickuprecords.push(r);
            }
          }
        }
        $scope.pickuprecords=$filter('orderBy')($scope.pickuprecords, 'product.id');
        $scope.pickupproducts=[];
        if($scope.pickuprecords.length!=0){
          var product=$scope.pickuprecords[0].product;
          product.pickupcount=0;
          for(var i=0;i<$scope.pickuprecords.length;i++){
            if($scope.pickuprecords[i].product.id!=product.id){
              $scope.pickupproducts.push(product);
              product=$scope.pickuprecords[i].product;
              product.pickupcount=0;
            }
            product.pickupcount=product.pickupcount+$scope.pickuprecords[i].quantity;
          }
          $scope.pickupproducts.push(product);
        }

        $scope.products=$filter('orderBy')($scope.products,'-count');
        $scope.productids=[];
        for(var i=0;i<$scope.products.length;i++){
          $scope.productids[i]=$scope.products[i].id;
        }
        $scope.topproducts=$scope.products.slice(0,6);
        if(response.meta.next&&!finish){
          loadorder(limit, offset+limit);
        }else{
          $scope.loading=false;
          $scope.firstload=false;
          localStorageService.add('HomeCtrl_orderids',JSON.stringify($scope.orderids));
          localStorageService.add('HomeCtrl_orders',JSON.stringify($scope.orders));
          localStorageService.add('HomeCtrl_products',JSON.stringify($scope.products));
          localStorageService.add('HomeCtrl_pickuprecords',JSON.stringify($scope.pickuprecords));
        }
      });
    };

    function updateproduct(p){
      var key=p.$$hashKey;
      var product=Products.get({'id':p.id},function(response){
        product.$$hashKey=key;
        product.count=p.count;
        p=product;
      });
    }

    $scope.purchaseRecordsProduct=[];
    $scope.purchaseRecordsProductid=[];
    $scope.purchaserecord=[];
    function loadpurchaserecord(limit, offset){

      var purchaserecord=PurchaseRecord.query({'limit':limit, 'offset':offset, }, function(response){
        if(response.length!=0){
          loadpurchaserecord(limit, offset+limit);
        }
        for(var i=0;i<purchaserecord.length;i++){
          var maxid=$scope.purchaserecord.length!=0?$scope.purchaserecord[0].id:-1;
          console.log(maxid);
          console.log(purchaserecord[i].id);
          if(maxid<purchaserecord[i].id){
            var pr=purchaserecord[i];
            $scope.purchaserecord.push(pr);
            if($scope.purchaseRecordsProductid.indexOf(pr.product)==-1){
              $scope.purchaseRecordsProductid.push(pr.product);
              var product={};
              $http.get(pr.product).success(function(response){
                  var index=$scope.purchaseRecordsProductid.indexOf(response.resource_uri);
                  $scope.purchaseRecordsProduct[index].id=response.id;
                  $scope.purchaseRecordsProduct[index].name=response.name;
                  $scope.purchaseRecordsProduct[index].pid=response.pid;
                  $scope.purchaseRecordsProduct[index].image=response.image;
              });
              $scope.purchaseRecordsProduct.push(product);
              product.records=[];
              product.records.push(pr);
            }else {
              var index=$scope.purchaseRecordsProductid.indexOf(pr.product);
              $scope.purchaseRecordsProduct[index].records.push(pr);
            }
            pr.left=pr.purchase_qty;
            purchaserecord[i].instocks=InstockRecord.query({'limit':0, 'purchase_record__id': purchaserecord[i].id}, function(response){
              for(var j=0;j<response.length;j++){
                pr.left=pr.left-response[j].initial_instock_qty;
              }
            });
          }
          $scope.purchaserecord=$filter('orderBy')($scope.purchaserecord, '-id'); 
        }
      });
    };
    loadpurchaserecord(10, 0);

    $scope.purchaserecordproductfilter=function(product){
      var left=0;
      for(var i=0;i<product.records.length;i++){
        left=left+product.records[i].left;
      }
      return left>0;
    }

    $scope.purchaserecordfilter=function(r){
      return r.left>0;
    }
}]);

//statistics
invenmgtControllers.controller('StatisticCtrl', ['$timeout', '$scope', '$filter', '$q', 'Orders', 'Employee', 'Products', 'Companys',
  function($timeout, $scope, $filter, $q, Orders, Employee, Products, Companys){
    $scope.enddate=new Date();
    $scope.startdate=new Date($scope.enddate-1000 * 60 * 60 * 24 * 30);
    $scope.today=new Date();
    $scope.dateOptions = {
      'year-format': "'yyyy'",
      'starting-day': 1
    };
    $scope.open = function($event) {
      $event.preventDefault();
      $event.stopPropagation();
      $scope.opened = true;
    };
    $scope.open1 = function($event) {
      $event.preventDefault();
      $event.stopPropagation();
      $scope.opened1 = true;
    };
    $scope.finishloading==false;
    //promises
    $scope.loaddate=function(){
      var progressleft=50;
      for(var i=0;i<49;i++){
        $timeout(function(){
          $scope.progress=$scope.progress+1;
          progressleft=progressleft-1;
        }, 200*(i+1));
      }
      $scope.finishloading=false;
      $scope.progress=0;
      var orderpromise=$q.defer();
      var employeepromise=$q.defer();
      var productpromise=$q.defer();
      var customerpromise=$q.defer();
      $scope.pendingorder=0;
      $scope.pickinguporder=0;
      $scope.readytoshiporder=0;
      $scope.shippedorder=0;
      $scope.completedorder=0;
      $scope.orders=Orders.query({'limit':0, 'date__gte':$scope.startdate.toJSON(), 'date__lte':$scope.enddate.toJSON()}, function(response){
        $scope.progress=$scope.progress+progressleft;
        orderpromise.resolve(response);
        for(var i=0;i<response.length;i++){
          response[i].total_price=parseFloat(response[i].total_price).toFixed(2);
          response[i].total_price=parseFloat(response[i].total_price)
          var d=new Date(response[i].date);
          response[i].date=d;
          if(response[i].status.name=="pending"){
            $scope.pendingorder++;
            response[i].statusvalue=20;
            response[i].statustype="primary";
          }else if(response[i].status.name=="picking up"){
            $scope.pickinguporder++;
            response[i].statusvalue=40;
            response[i].statustype="info"
          }else if(response[i].status.name=="ready to ship"){
            $scope.readytoshiporder++;
            response[i].statusvalue=60;
            response[i].statustype="info";
          }else if(response[i].status.name=="shipped"){
            $scope.shippedorder++;
            response[i].statusvalue=80;
            response[i].statustype="success";
          }else if(response[i].status.name=="completed"){
            $scope.completedorder++;
            response[i].statusvalue=100;
            response[i].statustype="success";
          }
        }
        //order status stat
          //basic info
          $scope.completion_ratio=($scope.completedorder/$scope.orders.length*100).toFixed(0);
          //draw piechart
          angular.element("#orders-components").sparkline([$scope.pendingorder, $scope.pickinguporder, $scope.readytoshiporder, $scope.shippedorder, $scope.completedorder], {
            type: 'pie',
            width: '95',
            height: '95',
            tooltipFormat: '{{offset:slice}} ({{percent.1}}%)',
            sliceColors: ['#949494','#42B5E5','#21A9E1', '#26B36A', '#00A651'],
            tooltipValueLookups: {
                'slice': ['Pending', 'Picking Up', 'Ready to Ship', 'Shipped', 'Completed']
            },
          }); 
       });

      $scope.employee=Employee.query({'limit':0}, function(response){
        $scope.progress=$scope.progress+20;
        employeepromise.resolve(response);
        $scope.adminnum=0;
        $scope.salesnum=0;
        $scope.invennum=0;
        $scope.accounum=0;
        $scope.mangrnum=0;
        $scope.inactivenum=0;
        for(var i=0;i<response.length;i++){
          if(response[i].employee_role.role=="account"&&response[i].is_active){
            $scope.accounum++;
          }else if(response[i].employee_role.role=="sales"&&response[i].is_active){
            $scope.salesnum++;
          }else if(response[i].employee_role.role=="invenmgr"&&response[i].is_active){
            $scope.invennum++;
          }else if(response[i].employee_role.role=="admin"&&response[i].is_active){
            $scope.adminnum++;
          }else if(response[i].employee_role.role=="mgr"&&response[i].is_active){
            $scope.mangrnum++;
          }else if(!response[i].is_active){
            $scope.inactivenum++;
          }
        }
        angular.element("#employee-components").sparkline([
          $scope.adminnum,
          $scope.salesnum,
          $scope.invennum,
          $scope.accounum,
          $scope.mangrnum,], {
          type: 'pie',
          width: '95',
          height: '95',
          tooltipFormat: '{{offset:slice}} ({{percent.1}}%)',
          tooltipValueLookups: {
              'slice': ['Administrator', 'Sales Representative', 'Inventory Manager', 'Accountant', 'Manager']
          },
        }); 
       });

      $scope.products=Products.query({'limit':0}, function(response){
        $scope.progress=$scope.progress+15;
        productpromise.resolve(response);
       });

      $scope.customers=Companys.query({'limit':0}, function(response){
        $scope.progress=$scope.progress+15;
        customerpromise.resolve(response);
        response=$filter('orderBy')(response, 'sales_channel.id');
        var name="";
        var channelnum=[];
        var channelname=[];
        var tempnum=0;
        $scope.customertotalnum=0;
        for(var i=0;i<response.length;i++){
          if(name!=response[i].sales_channel.channel_name&&response[i].sales_channel.channel_name!="Paid Client"&&response[i].sales_channel.channel_name!="Supplier"){
            if(name!=""){
              channelnum.push(tempnum);
              channelname.push(name);
            }
            tempnum=0;
            name=response[i].sales_channel.channel_name;
          }
          if(response[i].sales_channel.channel_name=="Paid Client"){
            $scope.symbol=response[i].default_currency.symbol;
          }
          if(response[i].sales_channel.channel_name!="Paid Client"&&response[i].sales_channel.channel_name!="Supplier"){
            $scope.customertotalnum=$scope.customertotalnum+1;
          }
          tempnum=tempnum+1;
        }
        channelnum.push(tempnum);
        channelname.push(name);
        angular.element("#customer-components").sparkline(channelnum, {
          type: 'pie',
          width: '95',
          height: '95',
          tooltipFormat: '{{offset:slice}} ({{percent.1}}%)',
          tooltipValueLookups: {
              'slice': channelname
          },
        }); 
      })

      $scope.figuretext="";
      $q.all([
        customerpromise,
        orderpromise.promise,
        productpromise.promise,
        employeepromise.promise,
        ]).then(function(){
          $timeout(function(){
            $scope.finishloading=true;
          }, 300);
          var daydiff=dayDiff($scope.startdate, $scope.enddate);
          var weekdiff=weekDiff($scope.startdate, $scope.enddate);
          var monthdiff=monthDiff($scope.startdate, $scope.enddate);

          //calculate sales ranking
          var range=0;
          var isdayfigure=false;
          var isweekfigure=false;
          var ismonthfigure=false;
          if(daydiff<=21){
            range=daydiff;
            isdayfigure=true;
            $scope.figuretext="Daily Graph";
          }else if(monthdiff<=3){
            range=weekdiff;
            isweekfigure=true;
            $scope.figuretext="Weely Graph";
          }else {
            range=monthdiff;
            ismonthfigure=true;
            $scope.figuretext="Monthly Graph";
          }

          $scope.topsales=[];
          var diff=0;
          var newsales={};
          $scope.orders=$filter('orderBy')($scope.orders, '-sales.username');
          var username="";
          for(var i=0;i<$scope.orders.length;i++){
            if(username!=$scope.orders[i].sales.username){
              username=$scope.orders[i].sales.username;
              if(i!=0){
                $scope.topsales.push(newsales);
                newsales={};
                newsales.name=username;
                newsales.sales=0;
                newsales.rangesales=[];
                for(var j=0;j<=range;j++){
                  newsales.rangesales[j]=0;
                }
              }else{
                newsales.name=username;
                newsales.sales=0;
                newsales.rangesales=[];
                for(var j=0;j<=range;j++){
                  newsales.rangesales[j]=0;
                }
              }
            }
            if($scope.orders[i].status.name=="completed"){
              newsales.sales=newsales.sales+$scope.orders[i].total_price;
              if(isdayfigure){
                diff=dayDiff($scope.orders[i].date, $scope.enddate);
              }else if(isweekfigure){
                diff=weekDiff($scope.orders[i].date, $scope.enddate);
              }else {
                diff=monthDiff($scope.orders[i].date, $scope.enddate);
              }
              newsales.rangesales[range-diff]=newsales.rangesales[range-diff]+$scope.orders[i].total_price;
            }
          }
          $scope.topsales.push(newsales);
          var max=0;
          for(var i=0;i<$scope.topsales.length;i++){
            for(var j=0;j<=range;j++){
              if($scope.topsales[i].rangesales[j]>max){
                max=$scope.topsales[i].rangesales[j];
              }
            }
          };
          $scope.topsales=$filter('orderBy')($scope.topsales,'-sales');
          $scope.topsalesbymonth=angular.copy($scope.topsales);
          $scope.topsales=$scope.topsales.slice(0,5);
          $scope.topsalesbymonth=$filter('orderBy')($scope.topsalesbymonth,'-monthsales[11]');
          $scope.topsalesbymonth=$scope.topsalesbymonth.slice(0,5);
          $scope.topsaleopts={type: 'bar', barColor: '#ff4e50', height: '20px', width: '100%', barWidth: 8, barSpacing: 1,  chartRangeMax:max};

          //product
          $scope.orderrecords=[];
          for(var i=0;i<$scope.orders.length;i++){
            for(var j=0;j<$scope.orders[i].records.length;j++){
              $scope.orders[i].records[j].date=$scope.orders[i].date;
              $scope.orders[i].records[j].orderstatus=$scope.orders[i].status.name;
              $scope.orderrecords.push($scope.orders[i].records[j]);
            }
          }
          $scope.orderrecords=$filter('orderBy')($scope.orderrecords, 'product.id');
          $scope.topproduct=[]
          var productid=$scope.orderrecords[0].product.id;
          var product={};
          product.name=$scope.orderrecords[0].product.name;
          product.pid=$scope.orderrecords[0].product.pid;
          product.totalsale=0;
          product.totalunit=0;
          product.rangesales=[];
          product.rangeunits=[];
          for(var i=0;i<=range;i++){
            product.rangesales[i]=0;
            product.rangeunits[i]=0;
          }
          for(var i=0;i<$scope.orderrecords.length;i++){
            if($scope.orderrecords[i].product.id!=productid){
              $scope.topproduct.push(product);
              var productid=$scope.orderrecords[i].product.id;
              var product={};
              product.name=$scope.orderrecords[i].product.name;
              product.pid=$scope.orderrecords[i].product.pid;
              product.totalsale=0;
              product.totalunit=0;
              product.rangesales=[];
              product.rangeunits=[];
              for(var j=0;j<=range;j++){
                product.rangesales[j]=0;
                product.rangeunits[j]=0;
              }
            }
            if($scope.orderrecords[i].status.name!="cancel"&&$scope.orderrecords[i].orderstatus=="completed"){
              product.totalsale=product.totalsale+parseInt($scope.orderrecords[i].discount_percentage)*parseInt($scope.orderrecords[i].quantity)*parseFloat($scope.orderrecords[i].product.rrp)/100;
              product.totalunit=product.totalunit+parseInt($scope.orderrecords[i].quantity);
              if(isdayfigure){
                diff=dayDiff($scope.orderrecords[i].date, $scope.enddate);
              }else if(isweekfigure){
                diff=weekDiff($scope.orderrecords[i].date, $scope.enddate);
              }else {
                diff=monthDiff($scope.orderrecords[i].date, $scope.enddate);
              }
              product.rangesales[range-diff]=product.rangesales[range-diff]+parseInt($scope.orderrecords[i].discount_percentage)*parseInt($scope.orderrecords[i].quantity)*parseFloat($scope.orderrecords[i].product.rrp)/100;
              product.rangeunits[range-diff]=product.rangeunits[range-diff]+parseInt($scope.orderrecords[i].quantity);
            }
          }
          $scope.topproduct.push(product);
          $scope.topproduct=$filter('orderBy')($scope.topproduct, '-totalsale');
          $scope.topproductunit=angular.copy($scope.topproduct);
          $scope.topproduct=$scope.topproduct.slice(0,5);
          $scope.topproductunit=$filter('orderBy')($scope.topproductunit, '-totalunit');
          $scope.topproductunit=$scope.topproductunit.slice(0,5);
          var max=0;
          var maxunit=0;
          for(var i=0;i<$scope.topproduct.length;i++){
            for(var j=0;j<=range;j++){
              if($scope.topproduct[i].rangesales[j]>max){
                max=$scope.topproduct[i].rangesales[j];
              }
              if($scope.topproductunit[i].rangeunits[j]>maxunit){
                maxunit=$scope.topproductunit[i].rangeunits[j];
              }
            }
          };
          $scope.topproductopts={type: 'bar', barColor: '#ff4e50', height: '20px', width: '100%', barWidth: 8, barSpacing: 1,  chartRangeMax:max};
          $scope.topproductunitopts={type: 'bar', barColor: '#ff4e50', height: '20px', width: '100%', barWidth: 8, barSpacing: 1,  chartRangeMax:maxunit};

          //customer
          $scope.topcustomer=[];
          var newcustomer={};
          $scope.orders=$filter('orderBy')($scope.orders, 'customer.name');
          var username="";
          for(var i=0;i<$scope.orders.length;i++){
            if(username!=$scope.orders[i].customer.name){
              channel=$scope.orders[i].customer.sales_channel.channel_name;
              username=$scope.orders[i].customer.name;
              if(i!=0){
                $scope.topcustomer.push(newcustomer);
                newcustomer={};
                newcustomer.name=username;
                newcustomer.channel=channel;
                newcustomer.sales=0;
                newcustomer.rangesales=[];
                for(var j=0;j<=range;j++){
                  newcustomer.rangesales[j]=0;
                }
              }else{
                newcustomer.name=username;
                newcustomer.channel=channel;
                newcustomer.sales=0;
                newcustomer.rangesales=[];
                for(var j=0;j<=range;j++){
                  newcustomer.rangesales[j]=0;
                }
              }
            }
            if($scope.orders[i].status.name=="completed"){
              newcustomer.sales=newcustomer.sales+$scope.orders[i].total_price;
              if(isdayfigure){
                diff=dayDiff($scope.orders[i].date, $scope.enddate);
              }else if(isweekfigure){
                diff=weekDiff($scope.orders[i].date, $scope.enddate);
              }else {
                diff=monthDiff($scope.orders[i].date, $scope.enddate);
              }
              newcustomer.rangesales[range-diff]=newcustomer.rangesales[range-diff]+$scope.orders[i].total_price;
            }
          }
          $scope.topcustomer.push(newcustomer);
          var max=0;
          for(var i=0;i<$scope.topcustomer.length;i++){
            for(var j=0;j<=range;j++){
              if($scope.topcustomer[i].rangesales[j]>max){
                max=$scope.topcustomer[i].rangesales[j];
              }
            }
          };
          $scope.topcustomer=$filter('orderBy')($scope.topcustomer,'-sales');
          $scope.topcustomer=$scope.topcustomer.slice(0,5);
          $scope.topcustomeropts={type: 'bar', barColor: '#ff4e50', height: '20px', width: '100%', barWidth: 8, barSpacing: 1,  chartRangeMax:max};
          
          //order
          var rangesales=[];
          $scope.totalsales=0;
          for(var i=0;i<=range;i++){
            rangesales[i]=0;
          }
          for(var i=0;i<$scope.orders.length;i++){
            if($scope.orders[i].status.name=="completed"){
              if(isdayfigure){
                $scope.salesrangetext="day";
                diff=dayDiff($scope.orders[i].date, $scope.enddate);
              }else if(isweekfigure){
                $scope.salesrangetext="week";
                diff=weekDiff($scope.orders[i].date, $scope.enddate);
              }else {
                $scope.salesrangetext="month";
                diff=monthDiff($scope.orders[i].date, $scope.enddate);
              }
              rangesales[range-diff]=rangesales[range-diff]+$scope.orders[i].total_price;
              $scope.totalsales=$scope.totalsales+$scope.orders[i].total_price;
            }
          }
          $scope.avgsales=($scope.totalsales/(range+1)).toFixed(2);
          $timeout(function(){
            var width = angular.element("#ordersales").width();
            angular.element(".monthly-sales").sparkline(rangesales, {
                type: 'bar',
                barColor: '#ff4e50',
                height: '55px',
                barWidth: parseInt(width/(range+1)),
                barSpacing: 1,
              }); 
          },400);
        });
    }
  }])

function monthDiff(d1, d2) {
    var months;
    months = (d2.getFullYear() - d1.getFullYear()) * 12;
    months -= d1.getMonth() + 1;
    months += d2.getMonth();
    return months+1;
}

function dayDiff(first, second) {

    var one = new Date(first.getFullYear(), first.getMonth(), first.getDate());
    var two = new Date(second.getFullYear(), second.getMonth(), second.getDate());

    var millisecondsPerDay = 1000 * 60 * 60 * 24;
    var millisBetween = two.getTime() - one.getTime();
    var days = millisBetween / millisecondsPerDay;

    days=Math.abs(days);
    return Math.floor(days);
}

function weekDiff(first, second) {

    var one = new Date(first.getFullYear(), first.getMonth(), first.getDate());
    var two = new Date(second.getFullYear(), second.getMonth(), second.getDate());

    var millisecondsPerWeek = 1000 * 60 * 60 * 24 * 7;
    var millisBetween = two.getTime() - one.getTime();
    var weeks = millisBetween / millisecondsPerWeek;

    weeks=Math.abs(weeks);
    return Math.ceil(weeks);
}
