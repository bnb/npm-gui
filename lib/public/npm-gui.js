webpackJsonp([1],[function(n,e,o){o(9),o(10),o(14),o(15),o(16),o(18),o(17),o(13),o(12),o(11)},,,,,,,,,function(n,e){!function(){"use strict";angular.module("npm-gui",["ngAnimate","ngRoute","ui.bootstrap"])}()},function(n,e){!function(){"use strict";angular.module("npm-gui").config(["$routeProvider","$locationProvider",function(n,e,o){n.when("/dependencies",{templateUrl:"app/modules/index.modules.html",controller:"ModulesController",controllerAs:"modules",resolve:{modules:["ListService",function(n){return n.modules}]}}).when("/dependencies-dev",{templateUrl:"app/modules/index.modules.html",controller:"ModulesController",controllerAs:"modules",resolve:{modules:["ListService",function(n){return n.devModules}]}}).when("/tasks",{templateUrl:"app/tasks/index.tasks.html",controller:"TasksController",controllerAs:"tasks"}).when("/builder",{templateUrl:"app/builder/index.builder.html",controller:"BuilderController",controllerAs:"builder"}).otherwise("/dependencies"),e.html5Mode(!1)}])}()},function(n,e){!function(){"use strict";function n(n,e){function o(){u.args.push({type:"",value:""})}function t(n){u.args.splice(n,1)}function r(){var e="./node_modules/"+u.command+"/bin/"+u.command;angular.forEach(u.args,function(n){e+=" "+n.value}),n.tasks.add(u.newTaskName,e)}var u=this;u.command=null,u.dependencies=n.modules.get(),u.devDependencies=n.devModules.get(),u.types=["flag","path"],u.args=[{type:"flag",value:"-d"},{type:"path",value:"./lib/helpers/*"}],u.addArg=o,u.removeArg=t,u.save=r,e.$watch("builder.command",function(){console.log(u.command)})}angular.module("npm-gui").controller("BuilderController",n)}()},function(n,e){!function(){"use strict";function n(n){function e(){n.clearLog()}var o=this;o.clearConsole=e,o.log=n.getLog()}angular.module("npm-gui").controller("ConsoleController",n)}()},function(n,e){!function(){"use strict";function n(n){function e(){l=new WebSocket("ws://"+location.host),l.onmessage=function(e){n(function(){u.data=u.data+e.data})}}function o(){return u}function t(){u.data=""}function r(){}var u={data:""},l=null;return e(),{getLog:o,clearLog:t,sendCommand:r}}angular.module("npm-gui").factory("ConsoleService",n)}()},function(n,e){!function(){"use strict";function n(n){function e(e){function o(){a.clearFlags(),a.loading=!0;var o={method:"GET",url:"/"+e};return n(o).success(t).error(r),a}function t(n){angular.copy(n,a.data),a.clearFlags()}function r(){a.clearFlags(),a.error=!0}function u(o,t){var r={method:"PUT",url:"/"+e,data:{key:o,value:t}};n(r)}function l(o){var t={method:"DELETE",url:"/"+e+"/"+o};n(t)}var a={loading:!1,error:!1,data:[],clearFlags:function(){this.loading=!1,this.error=!1}};return{get:o,add:u,remove:l}}return e}angular.module("npm-gui").factory("ListFactory",n)}()},function(n,e){!function(){"use strict";function n(n){var e=new n("modules"),o=new n("devModules"),t=new n("tasks");return{modules:e,devModules:o,tasks:t}}angular.module("npm-gui").factory("ListService",n)}()},function(n,e){!function(){"use strict";function n(n){function e(){n.add(u.newModuleName,u.newModuleVersion),u.newModuleName="",u.newModuleVersion=""}function o(e){n.remove(e.key)}function t(){u.list=n.get()}function r(){u.list=n.get()}var u=this;t(),u.addModule=e,u.removeModule=o,u.loadModules=t,u.reinstallModules=r}angular.module("npm-gui").controller("ModulesController",n)}()},function(n,e){!function(){"use strict";function n(n,e){function o(){n.tasks.add(l.newTaskName,l.newTaskCommand),l.newTaskName="",l.newTaskCommand=""}function t(e){n.tasks.remove(e.key)}function r(n){e.run(n.key)}function u(){l.list=n.tasks.get()}var l=this;u(),l.addTask=o,l.removeTask=t,l.runTask=r,l.loadTasks=u}angular.module("npm-gui").controller("TasksController",n)}()},function(n,e){!function(){"use strict";function n(n){function e(e){var o={method:"POST",url:"/tasks/"+e};n(o)}return{run:e}}angular.module("npm-gui").factory("TasksService",n)}()}]);