var myCodeMirror;
var store = new Persist.Store('Moo');

DomReady.ready(function() {
  store.get("currentdoc", function(ok, data) {
    if (ok)
      document.getElementById("editor").value = data;
  });
  if (document.getElementById("editor").value == "") {
    document.getElementById("editor").value = "# Hello";
  }

  myCodeMirror = CodeMirror.fromTextArea(document.getElementById("editor"), {
    mode: "gfm",
    theme: "monokai",
    autofocus: true,
    extraKeys: {
      "Ctrl-Enter": linker
    }
  });
  CodeMirror.on(myCodeMirror, "change", setCurrentDoc);

  myCodeMirror.setCursor(myCodeMirror.lastLine, myCodeMirror.getLine(myCodeMirror.lastLine).length);

  setInterval(updateTime, 1000);

  updateTime();
  setCurrentDoc();
});

function setCurrentDoc() {
    /* i've thrown the footer updater in here as well! */
    document.getElementById("length").innerHTML = myCodeMirror.getValue().length + " chars";

    myCodeMirror.save();
    store.set("currentdoc", document.getElementById("editor").value);
    console.log("saved.");
    return true;
}

function updateTime() {
  document.getElementById("time").innerHTML = (new Date).toLocaleTimeString().substring(0, 5);
}

function linker() {
  var lnum = myCodeMirror.getCursor().line;
  var lint = myCodeMirror.getLine(lnum).trim();
  if (lint.slice(0, 1) == "@") {
    if (lint.slice(1, 4) == "gs ") {
      window.open("https://google.co.uk/search?q=" + encodeURIComponent(lint.slice(4).trim()));
    }
    else if (lint.slice(1, 4) == "do " || lint.slice(1, 4) == "wa ") {
      window.open("http://wolframalpha.com/input/?i=" + encodeURIComponent(lint.slice(4).trim()));
    }
    else if (lint.slice(1, 4) == "cal") {
      window.open("https://calendar.google.com/");
    }
    else if (lint.slice(1, 4) == "gt ") {
      window.open("http://" + encodeURI(lint.slice(4).trim()));
    }
    else if (lint.slice(1, 5) == "gts ") {
      window.open("https://" + encodeURI(lint.slice(5).trim()));
    }
    else if (lint.slice(1, 5) == "gtl ") {
      window.open(encodeURI(lint.slice(5).trim()));
    }
  }
}