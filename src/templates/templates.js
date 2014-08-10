
function JadeTemplate(name){
  var html = $("#Jade-Templates-"+name).html();
  html = html.replace(/&lt;%/g, "<%");
  html = html.replace(/%&gt;/g, "%>");
  return html;
}

function CodeTemplate(name){
  var html = $("#Code-Templates-"+name).html();
  html = html.replace(/&lt;%/g, "<%");
  html = html.replace(/%&gt;/g, "%>");
  return html;
}
