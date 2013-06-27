window.addEventListener('load', function() {
  document.getElementById('save').addEventListener('click', function() {
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;
    localStorage.setItem('__username', username);
    localStorage.setItem('__password', password);
    alert('Saved!');
  });
});
