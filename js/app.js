angular.module('gistviewer', [])
  .config(function($routeProvider, $compileProvider) {
    $routeProvider
      .when('/gists', {
        templateUrl: 'partials/gist-list.html',
        controller: GistListCtrl
      })

      .when('/gists/:gistId', {
        templateUrl: 'partials/gist-detail.html',
        controller: GistDetailCtrl
      })

      .when('/gists/:gistId/edit', {
        templateUrl: 'partials/gist-edit.html',
        controller: GistEditCtrl
      })

      .otherwise({redirectTo: '/gists'})
      ;

    $compileProvider.urlSanitizationWhitelist(
      /^\s*(https?|ftp|mailto|file|chrome-extension):/
    );
  })
  ;
