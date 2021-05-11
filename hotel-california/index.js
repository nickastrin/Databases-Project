var btn = false;

function loadDoc() {
  if (!btn) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        document.getElementById("txtResult").innerHTML = this.responseText;
      }
    };
    xhttp.open("GET", "app.php?", true);
    xhttp.send();
  } else {
    document.getElementById("txtResult").innerHTML = "";
  }
  btn = !btn;
}
