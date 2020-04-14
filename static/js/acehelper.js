
var toolbarHeight = 24;
function createAceEditor(cfg){
  var parent = cfg.parent;
  var id = cfg.id;
  var height = cfg.height;
  var code = cfg.code.trim();
  var onCodeWillRun = cfg.onCodeWillRun;
  var onCodeRunEnd = cfg.onCodeRunEnd;
  var readOnly = cfg.readOnly || false;
  var language = cfg.language || 'javascript';
  parent.append('<span class="caret" id="caret_' + id + '" style="color: #357edd;" >隐藏代码</span>');
  var codeInput = $('<div id="' + id + '" style="width: 100%; height: '+height+'px;border: 1px solid lightgray;">').appendTo(parent);
  if(!readOnly){
    let toolbar = $('<div id="toolbar_' + id + '" style="width: 100%; height: '+toolbarHeight+'px; background: #F0F0F0;align-items: center;text-align: left;left: 0px;margin-top:-1px;border: 1px solid lightgray;">').appendTo(parent);
    $('<button class="play-code-button" id="img_'+ id + '">').appendTo(toolbar);
  }
  var editor = ace.edit(id,{theme: "ace/theme/xcode",readOnly:readOnly});
  editor.session.setMode("ace/mode/"+language);
  editor.setShowPrintMargin(false);
  editor.setAutoScrollEditorIntoView(true);

  //ContentFit($("#"+id),height);
  // if(!readOnly){
  //   ContentFit($("#toolbar_"+id),toolbarHeight);
  // }
  
  $("#caret_"+id).on('click',(e)=>{
    var editorElement = [$("#"+id)];
    if (!readOnly) {
      editorElement.push($('#toolbar_'+id));
    }
    var caretElement = $("#caret_"+id);
    var v = editorElement[0].css('display')

    if(v === 'none')
    {
      editorElement.forEach(e => e.css('display','block'));
      caretElement.removeClass('caret-down');
      caretElement.text("隐藏代码");
    }
    else
    {
      editorElement.forEach(e => e.css('display','none'));
      caretElement.addClass('caret-down');
      caretElement.text("显示代码");
    }
  });
  let runeditor = function (){
    var code = editor.getValue();  
    if(onCodeWillRun != null)
    {  
      code = onCodeWillRun(code);
    }

    if(code !== null){
      var script = $('#script_'+id)
      if(script !== undefined)
        script.remove();
      script = $('<script id="script_'+id + '"> </script>');
      script.text(code);
      script.appendTo('head');      
    }

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
  runeditor();
  $('#img_'+id).on('click',runeditor);
  return runeditor;
}
