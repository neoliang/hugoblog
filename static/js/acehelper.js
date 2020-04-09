
function ContentFit(mapElement,height) {
   var onResize = function(e) {    
    var scale = height/720
    mapElement.css("height", mapElement.width() * scale);
  };
  onResize();
  window.addEventListener("resize",onResize);
}

function createAceEditor(cfg){
  var parent = cfg.parent;
  var id = cfg.id;
  var height = cfg.height;
  var code = cfg.code;
  var onCodeWillRun = cfg.onCodeWillRun;
  var onCodeRunEnd = cfg.onCodeRunEnd;
  parent.append('<span class="caret" id="caret_' + id + '" style="color: #357edd;" >隐藏代码</span>');
  parent.append('<div id="' + id + '" style="max-width: 100%; height: 360px;border: 1px solid lightgray;"></div>');
  var editor = ace.edit(id,{theme: "ace/theme/github"});
  editor.session.setMode("ace/mode/javascript");
  editor.setShowPrintMargin(false);
  editor.setAutoScrollEditorIntoView(true);
  ContentFit($("#"+id),height);
  $("#caret_"+id).on('click',(e)=>{
    var editorElement = $("#"+id);
    var caretElement = $("#caret_"+id);
    var v = editorElement.css('display')

    if(v === 'none')
    {
      editorElement.css('display','block')
      caretElement.removeClass('caret-down')
      caretElement.text("隐藏代码")
    }
    else
    {
      editorElement.css('display','none')
      caretElement.addClass('caret-down')
      caretElement.text("显示代码")
    }
  });
  function runeditor(editor)
  {
    var code = editor.getValue();  
    if(onCodeWillRun != null)
      code = onCodeWillRun(code);

    var script = $('#script_'+id)
    if(script !== undefined)
      script.remove();

    script = $('<script id="script_'+id + '">');
    script.text(code);
    script.appendTo('head');
    var editorElement = $("#"+id);
    editorElement.css('transform','scale(1.02)')
    setInterval(()=>{editorElement.css('transform','scale(1)')},200);
    if(onCodeRunEnd != null)
      onCodeRunEnd();
  }
  editor.setValue(code,1);
  
  editor.commands.addCommand({
    name:'run',
    bindKey: {win: 'Ctrl-Enter',  mac: 'Command-Enter'},
      exec: runeditor,
      readOnly: false 
  }); 
  runeditor(editor);
  return editor;
}