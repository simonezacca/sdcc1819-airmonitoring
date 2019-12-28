'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the sbAdminApp
 */

mainAngularModule
    .controller('UserInfoController', ['$scope', '$state', '$stateParams', 'UserDataFactory', 'AuthFactory', 'ErrorStateRedirector',
        function ($scope, $state, $stateParams, UserDataFactory, AuthFactory, ErrorStateRedirector) {

            var ctrl = this;

            ctrl.showUser = showUserFn;
            ctrl.updateUser = updateUserFn;
            ctrl.resetFields = resetFieldsFn;
            ctrl.changeState = changeStateFn;
            ctrl.printValue = printValueFn;
            ctrl.isAdmin = isAdminFn;
            ctrl.value = true;


            ctrl.user = {};
            ctrl.userGroups = {};
            ctrl.oldUser = null;

            init();

            function init() {
                showUserFn();
            }

            ctrl.userTypes = [{
                label: 'Customer',
                role: {
                    type: 'customer'
                }
            },
                {
                    label: 'Assistant',
                    role: {
                        type: 'assistant',
                    }
                },
                {
                    label: 'Help desk operator',
                    role: {
                        type: 'help_desk_operator'
                    }
                }
            ];

            function printValueFn() {
                console.log(ctrl.user);
                console.log(ctrl.oldUser);
            }

            function changeStateFn() {
                if (ctrl.value) {
                    ctrl.oldUser = angular.copy(ctrl.user);
                    ctrl.value = false;
                } else {
                    ctrl.value = true;
                }
            }

            function showUserFn() {
                let userId = $stateParams.userId;
                if (checkUserId(userId)) {
                    UserDataFactory.GetSingle(userId,
                        function (user) {
                            ctrl.user = user;
                            UserDataFactory.GetGroupByUserID(ctrl.user.id,
                                function (userGroups) {
                                    ctrl.userGroups = userGroups;
                                });
                        }, function (error) {
                            ErrorStateRedirector.GoToErrorPage({Messaggio: "Errore nell'import dell' user"});

                        });
                } else {
                    ErrorStateRedirector.GoToErrorPage({Messaggio: "Id utente non tuo"});
                }

            }

            function updateUserFn() {
                if (ctrl.user.userType.type === 'customer') {
                    ctrl.user.userType = 'Customer';
                } else if (ctrl.user.userType.type === 'assistant') {
                    ctrl.user.userType = 'Assistant'
                } else if (ctrl.user.userType.type === 'help_desk_operator') {
                    ctrl.user.userType = 'HelpDeskOperator';
                }

                UserDataFactory.Update(ctrl.user,
                    function () {
                        $state.go("dashboard.home");
                    }, function (error) {
                        ErrorStateRedirector.GoToErrorPage({Messaggio: "Errore nell'update dell'utente"});

                    });
            }

            function checkUserId(userId) {
                let authInfo = AuthFactory.getAuthInfo();
                if (authInfo.userType === "admin") {
                    return true;
                }
                if (userId != authInfo.userId) {
                    return false;
                }
                return true;
            }

            function resetFieldsFn() {
                ctrl.user = ctrl.oldUser;
            }

            function isAdminFn(usertype){

                return userType === 'admin';

            }

        }

    ]);