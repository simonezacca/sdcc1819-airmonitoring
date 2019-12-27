'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:MainCtrl
 * @description
 * # LoginCtrl
 */
mainAngularModule
    .controller('LoginCtrl', ['$scope', '$state', 'AuthFactory',
        function ($scope, $state, AuthFactory) {

            let ctrl = this;
            ctrl.authRequest = {username: 'assistant1', password: 'assistant1'};
            ctrl.doLogin = doLoginFn;


            ctrl.authMessage = '';

            function doLoginFn() {
                console.log("doLoginFn");
                //AuthFactory.sendLogin(ctrl.authRequest, successCB, errorCB);
                $state.go("dashboard.home");
                //function successCB(response) {
                //    let authInfo = response.data;
                //    let header = response.headers();
                //    authInfo.jwtToken = header['authorization'];
                //
                //    // AuthFactory.user.username = authInfo.username;
                //    // AuthFactory.user.role = authInfo.role;
                //    let debugJWT = true;
                //    if (debugJWT) {
                //        console.log("username: " + authInfo.username);
                //        console.log("roles: " + JSON.stringify(authInfo.authorities));
                //        console.log("jwtToken: " + authInfo.jwtToken);
                //        console.log("userType: " + authInfo.userType);
                //    }
                //    AuthFactory.setJWTAuthInfo(authInfo);
                //    $state.go("dashboard.home");
                //}

                /*function errorCB(response) {
                    let error = response.data;
                    if (error && error.code === 401) {
                        ctrl.authMessage = error.message;
                    }
                    else {
                        console.error(response);
                        ctrl.authMessage = 'No response from server';
                    }
                }*/

            }

        }


    ]);