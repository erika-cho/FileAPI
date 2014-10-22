function getParam() {
  if (window.location.href.indexOf('?') >= 0) {
    var url = location.href;
    params = url.split('?');
    paramms = params[1].split('&');
    var paramArray = [];
    for ( i = 0; i < paramms.length; i++ ) {
      neet = paramms[i].split('=');
      paramArray.push(neet[0]);
      paramArray[neet[0]] = neet[1];
    }
    content.set(paramArray['pj']);
    //getProject(paramArray['no']);
  }else{
    window.location.href = '../index.html';
  }
}


var util = {
  stop: function(event) {
    event.preventDefault();
    event.stopPropagation();
  }
}

var path = {}
var project = function(test, product) {
  this.test = test;
  this.product = product;
}

project.prototype.set = function() {
  path =  {test: this.test, product: this.product};
}

var vaio = new project('vaio.lgts.biz', 'www.sony.co.jp');
var bravia = new project('braviamail.lgts.biz', 'www.sony.co.jp');

var content = {
  set: function(pj) {
    var projectName = pj;
    $('#set').val(projectName);
    $('h1').text(projectName.toUpperCase());
    if(projectName == 'vaio') vaio.set();
    if(projectName == 'bravia') bravia.set();
  }
}

$(function() {
  getParam();
  var source = '';
  var linkAll = '';
  var charset = 'Shift_JIS';
  var inputFile = $('#input');
  var outputFile = $('#output code');
  var checkField = $('#result');
  var toolNav = $('#global-nav');

  // ファイル読み込み
  inputFile.on({
    dragover: util.stop,
    dragenter: util.stop,
    dragleave: util.stop,
    drop: function(event) {
      util.stop(event);
      var file = event.originalEvent.dataTransfer.files[0];
      var reader = new FileReader();
      reader.onload = onTextLoad;
      reader.readAsText(file, charset);
      return false;
    }
  });

  // ファイルの内容を表示
  function onTextLoad(event) {
    var content = event.target.result;
    outputFile.text(content);
    inputFile.hide();
    toolNav.show();
  }


  $('#convert-product').on('click', function(){
    product();
    return false;
  });

  $('#convert-test').on('click', function(){
    test();
    return false;
  });

  function test() {
    var retcode = '\r\n';
    var outputFile = $('#output code');
    var content = outputFile.text();
    var contentLine = content.split(retcode);
    reset.source();
    for (var i = 0; i < contentLine.length; i++) {
      var line = contentLine[i];
      if (line.match(path.product)) {
        line = line.replaceAll(path.product, path.test);
      }
      reset.source();
      source += line + retcode;
    }
    outputFile.text(source);
    alert('作業用コードに変換しました');
  }

  function product() {
    var retcode = '\r\n';
    var outputFile = $('#output code');
    var content = outputFile.text();
    var contentLine = content.split(retcode);
    for (var i = 0; i < contentLine.length; i++) {
      var line = contentLine[i];
      if (line.match(path.test)) {
        line = line.replaceAll(path.test, path.product);
      }
      reset.source();
      source += line + retcode;
    }
    outputFile.text(source);
    alert('提出用コードに変換しました');
  }

  String.prototype.replaceAll = function(org, dest) {
    return this.split(org).join(dest);
  }

  var reset = {
    source: function() {
      delete source;
      outputFile.empty();
    }
  }
});


