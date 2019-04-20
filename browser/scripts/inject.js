export default function createPara() {
  const body = document.querySelector('body');
  const para = document.createElement('p');
  const txt = document.createTextNode('******** BLAH ********');
  para.appendChild(txt);
  body.appendChild(para);
}
