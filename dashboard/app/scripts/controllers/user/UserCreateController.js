'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the sbAdminApp
 */
mainAngularModule
    .controller('UserCreateCtrl', ['$scope', '$state', 'UserDataFactory', 'ErrorStateRedirector',
        function ($scope, $state, UserDataFactory, ErrorStateRedirector) {

            var ctrl = this;
            ctrl.resetFields = resetFieldsFn;
            ctrl.insertUser = insertUserFn;

            ctrl.userTypes = [
                'Customer',
                'Assistant',
                'HelpDeskOperator'
            ];

            resetFieldsFn();
            ctrl.resetFields = resetFieldsFn;
            ctrl.insertUser = insertUserFn;


            function resetFieldsFn() {
                ctrl.currentUser = {userType: "Customer"};
            }

            function insertUserFn() {
                UserDataFactory.Insert(
                    ctrl.currentUser,
                    function (user) {
                        console.log(user);
                        resetFieldsFn();
                        $state.go('user.list', {}, {reload: 'user.list'});
                    }, function (response) {
                        ErrorStateRedirector.GoToErrorPage(
                            {
                                Info: "Errore in inserimento utente. Riprova."
                            }
                        )
                    }
                );
            }
        }

    ]);