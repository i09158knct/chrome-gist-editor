function getGistMainFileName(gist) {
  if (gist == null) { return 'Loading...'; }
  return Object.keys(gist.files)[0];
}

function extractGistEditDelta(gist, deletedFiles) {
  var pairs = _.pairs(gist.files);
  var validPairs = pairs.map(function(pair) {
    var filename = pair[0];
    var body = pair[1];
    return (/^\uffff/.test(filename)) ?
      [body.filename, body] :
      [filename, body];
  }).concat(deletedFiles.map(function(filename) {
    return [filename, null];
  }));

  return validPairs.reduce(function(acc, pair) {
    acc.files[pair[0]] = pair[1];
    return acc;
  }, {description: gist.description, files: {}});
}

function showGist(gistId) {
  window.location.hash = '/gists/' + gistId;
}

function editGist(gistId) {
  window.location.hash = '/gists/' + gistId + '/edit';
}

function deleteGist(gistId) {
  if (confirm('Are you sure?')) {
    github.getGist(gistId).delete(function(err, success) {
      if (success) { window.location.hash = '/gists'; }
      else { alert('Error.'); console.log(err, success); }
    });
  }
}


function GistListCtrl($scope, github) {
  $scope.getGistMainFileName = getGistMainFileName;

  $scope.order = 'updated_at';
  $scope.gists = JSON.parse(localStorage.getItem('__gists'));
  github.getUser().gists(function(err, gists) {
    $scope.gists = gists;
    $scope.$apply();

    localStorage.setItem('__gists', JSON.stringify(gists || {}));
  });
}

function GistDetailCtrl($scope, $routeParams, github) {
  var id = $routeParams.gistId;
  $scope.getGistMainFileName = getGistMainFileName;
  $scope.editGist = editGist;
  $scope.deleteGist = deleteGist;

  $scope.gist = JSON.parse(localStorage.getItem(id));
  github.getGist(id).read(function(err, gist) {
    $scope.gist = gist;
    $scope.$apply();

    localStorage.setItem(id, JSON.stringify(gist || {}));
  });
}

function GistEditCtrl($scope, $routeParams, github) {
  var id = $routeParams.gistId;
  $scope.getGistMainFileName = getGistMainFileName;
  $scope.showGist = showGist;
  $scope.deleteGist = deleteGist;

  $scope.addAnotherFile = function() {
    $scope.gist.files['\uffff' + Date.now()] = {
      filename: 'file' + _.uniqueId() + '.txt',
      content: ''
    };
  };

  $scope.update = function(gistId) {
    var delta = extractGistEditDelta($scope.gist, $scope.deletedFiles);
    github.getGist(gistId).update(delta, function(err, success) {
      if (success) { showGist(gistId); }
      else { alert('Error.'); console.log(err, success); }
    });
  };

  $scope.deleteFile = function(filename, files) {
    $scope.deletedFiles.push(filename);
    delete files[filename];
  };

  $scope.deletedFiles = [];
  $scope.gist = JSON.parse(localStorage.getItem(id));
  github.getGist(id).read(function(err, gist) {
    $scope.gist = gist;
    $scope.$apply();

    localStorage.setItem(id, JSON.stringify(gist || {}));
  });
}