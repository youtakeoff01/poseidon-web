/*
 * auth yanglijuan
 * date 2017-06-14
 * description 路由配置
 */
(function () {
    'use strict';

    App.config(function ($stateProvider, $urlRouterProvider, $locationProvider) {
       /* $locationProvider.html5Mode(true);*/
        $urlRouterProvider.otherwise('/login');

        $stateProvider
            .state('login', {
                url: '/login',
                templateUrl: 'app/pages/identity/login/login.html',
                ncyBreadcrumb: {label: '登录'}
            })


            /* start-魔方桌面主页面 -start */
            .state('home',{
                url: '/home',
                templateUrl: 'app/pages/destopHomepage/homePage.html',
                ncyBreadcrumb: {
                    label: '桌面主页'
                }
            })
            
            /* end-魔方桌面主页面 -end */

            .state('app', {
                url: '/app',
                templateUrl: 'app/pages/layout/app.html',
                ncyBreadcrumb: {
                    label: '主页',
                    skip: true
                }
            })
            /*start-控制台 -start*/

            .state('app.console', {
                url: '/console',
                abstract: true,
                templateUrl: 'app/pages/layout/wrap.html'
            })
            .state('app.console.opmaintEchart', {
                url: '/opmaintEchart',
                templateUrl: 'app/pages/console/opmaintEchart.html',
                ncyBreadcrumb: {label: '控制台'}
            })
            .state('app.console.opmaintList', {
                url: '/opmaintList',
                templateUrl: 'app/pages/console/opmaintList.html',
                ncyBreadcrumb: {label: '控制台列表'}
            })
            /*end-控制台-end*/

            /*start-数据集成  dataIntegration-start*/
            .state('app.integration', {
                url: '/integration',
                abstract: true,
                templateUrl: 'app/pages/layout/wrap.html'
            })
            .state('app.integration.source', {
                url: '/source',
                templateUrl: 'app/pages/dataIntegration/source/source.html',
                ncyBreadcrumb: {label: '数据源管理'}
            })
            .state('app.integration.sync', {
                url: '/sync',
                templateUrl: 'app/pages/dataIntegration/sync/sync.html',
                ncyBreadcrumb: {label: '数据同步'}
            })
            /*end-数据集成  dataIntegration-end*/

            /*start-数据管理 dataManagement-start*/
            .state('app.dataManagement', {
                url: '/dataManagement',
                abstract: true,
                templateUrl: 'app/pages/layout/wrap.html'
            })
            .state('app.dataManagement.permissionQuery', {
                url: '/permissionQuery',
                templateUrl: 'app/pages/dataManagement/permission/permissionQuery.html',
                ncyBreadcrumb: {label: '权限管理'}
            })
            .state('app.dataManagement.table', {
                url: '/table',
                templateUrl: 'app/pages/dataManagement/table/table.html',
                ncyBreadcrumb: {label: '表数据'}
            })
            /*end-数据管理 dataManagement-end*/

            /*start-平台管理 platformDevelopment-start*/
            .state('app.platformManage', {
                url: '/platformManage',
                abstract: true,
                templateUrl: 'app/pages/layout/wrap.html'
            })
            .state('app.platformManage.log', {
                url: '/log',
                templateUrl: 'app/pages/platformManage/log/log.html',
                ncyBreadcrumb: {label: '系统日志'}
            })
            .state('app.platformManage.sysSet', {
                url: '/sysSet',
                templateUrl: 'app/pages/platformManage/sysSet/sysSet.html',
                ncyBreadcrumb: {label: '系统设置'}
            })
            .state('app.platformManage.userGroup', {
                url: '/userGroup',
                templateUrl: 'app/pages/platformManage/userGroup/userGroup.html',
                ncyBreadcrumb: {label: '用户组管理'}

            })
            .state('app.platformManage.userManage', {
                url: '/userManage',
                templateUrl: 'app/pages/platformManage/userManage/userManage.html',
                ncyBreadcrumb: {label: '用户管理'}
            })
            /*end-平台管理 platformDevelopment-end*/

            /*start-运维中心 operationCenter-start*/
            .state('app.operation', {
                url: '/operation',
                abstract: true,
                templateUrl: 'app/pages/layout/wrap.html'
            })
            .state('app.operation.ditch', {
                url: '/ditch',
                templateUrl: 'app/pages/operationCenter/ditch/ditchWarn.html',
                ncyBreadcrumb: {label: '通知渠道'}
            })
            .state('app.operation.custom', {
                url: '/custom',
                templateUrl: 'app/pages/operationCenter/custom/customWarn.html',
                ncyBreadcrumb: {label: '自定义通知'}
            })
            .state('app.operation.opmanage', {
                url: '/opmanage',
                templateUrl: 'app/pages/operationCenter/operManage/opmanage.html',
                ncyBreadcrumb: {label: '任务管理'}
            })
            .state('app.operation.history', {
                url: '/history?typeName',
                templateUrl: 'app/pages/operationCenter/operManage/opmanageHistory.html',
                ncyBreadcrumb: {label: '任务历史详情'}
            })
            .state('app.operation.opcase', {
                url: '/opcase',
                templateUrl: 'app/pages/operationCenter/operCase/opmaintCase.html',
                ncyBreadcrumb: {label: '任务情况'}
            })
            .state('app.operation.opermachine', {
                url: '/opermachine?mid&mName',
                templateUrl: 'app/pages/operationCenter/operManage/machineDetail.html',
                ncyBreadcrumb: {label: '机器学习详情'}
            })


            /*end-运维中心 operationCenter-end*/


            /*start-数据开发 dataDevelopment-start*/
            .state('app.dataDevelopment', {
                url: '/dataDevelopment',
                abstract: true,
                templateUrl: 'app/pages/layout/wrap.html'
            })
            .state('app.dataDevelopment.search', {
                url: '/search',
                templateUrl: 'app/pages/dataDevelopment/search/dataSearch.html',
                ncyBreadcrumb: {label: '数据加工'}
            })
            /*end-数据开发 dataDevelopment-end*/

            /*start-机器学习 machineLearning-start*/
            .state('app.artificial', {
                url: '/artificial',
                abstract: true,
                templateUrl: 'app/pages/layout/wrap.html'
            })
            .state('app.artificial.machine', {
                url: '/machine',
                templateUrl: 'app/pages/machineLearning/machine/machineLearning.html',
                ncyBreadcrumb: {label: '机器学习'}
            })

            /*end-机器学习 machineLearning-end*/
});







})();
	