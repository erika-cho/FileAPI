window.onload = function() {
  $('#reader').on('dragover', onCancel, false);
  $('#reader').on('dragenter', onCancel, false);
  $('#reader').on('dragleave', onCancel, false);
  $('#reader').on('drop', onDropFile);
}
var onCancel = function(event) {
  event.preventDefault();
  event.stopPropagation();
};
var onDropFile = function(event) {
  onCancel(event);
  var file = event.originalEvent.dataTransfer.files[0];
  var reader = new FileReader();
  reader.onload = onTextLoad;
  reader.readAsArrayBuffer(file);
};
var onTextLoad = function(event) {
  var source = '';
  var content = event.target.result;
  var array = new Uint8Array(content);
  switch (Encoding.detect(array)) {
    case 'UTF16':
      array = new Uint16Array(content);
      break;
    case 'UTF32':
      array = new Uint32Array(content);
      break;
  }
  var unicodeArray = Encoding.convert(array, 'UNICODE');
  var code = Encoding.codeToString(unicodeArray);

  String.prototype.replaceAll = function (org, dest){
    return this.split(org).join(dest);
  }

  code = code.replaceAll('^\n', '');
  line = code.split('\r\n');
  for (var i = 0; i < line.length; i++) {
    var codeLine = line[i];
    codeLine = codeLine.replaceAll('&', '&quot;');
    codeLine = codeLine.replaceAll('<', '&lt;');
    codeLine = codeLine.replaceAll('>', '&gt;');
    codeLine = codeLine.replaceAll(' ', '&nbsp;');
    codeLine = codeLine.replaceAll('  ', '&nbsp;&nbsp;');
    codeLine = codeLine.replaceAll('"', '&quot;');
    codeLine = codeLine.replaceAll('©', '&copy;');
    source += '<pre id="line-' + i + '"><code>' + codeLine + '</code></pre>';
  }

  $('#output').append(source);
  $('#reader').hide();
  getDoctype();
};