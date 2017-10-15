(function () {
    'use strict';

    angular
        .module('app')
        .controller('Account.IndexController', Controller);

    function Controller($window, UserService, FlashService) {
        var vm = this;

        vm.admin = null;
        vm.saveAdmin = saveAdmin;
        vm.deleteAdmin = deleteAdmin;

        initController();

        function initController() {
            // get current user
            AdminService.GetCurrent().then(function (user) {
                vm.admin = admin;
            });
        }

        function saveAdmin() {
            AdminService.Update(vm.admin)
                .then(function () {
                    FlashService.Success('Admin updated');
                })
                .catch(function (error) {
                    FlashService.Error(error);
                });
        }

        function deleteAdmin() {
            AdminService.Delete(vm.admin._id)
                .then(function () {
                    // log user out
                    $window.location = '/adminLogin';
                })
                .catch(function (error) {
                    FlashService.Error(error);
                });
        }
    }

})();
