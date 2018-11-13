export function escapeHTML(str){
  var span = document.createElement('span');
  span.appendChild(document.createTextNode(str));
  return span.innerHTML;
}
