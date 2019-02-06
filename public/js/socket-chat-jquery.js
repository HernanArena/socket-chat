var params = new URLSearchParams(window.location.search);
// referencia de Jquery
var nombre = params.get('nombre');
var sala = params.get('sala');

var divUsuarios =$('#divUsuarios');
var formEnviar = $('#formEnviar');
var txtMensaje = $('#txtMensaje');
var divChatbox = $('#divChatbox');
//Funciones para renderizar usuarios
function renderizarUsuarios(personas){

  console.log(personas);
  var html = ''
  html +='<li> ';
  html +='    <a href="javascript:void(0)" class="active"> Chat de <span>'+params.get('sala') +'</span></a> ';
  html +='</li>';

  for(var i in personas){
    html +='<li> ';
    html +='    <a data-id="'+personas[i].id+'" href="javascript:void(0)"><img src="assets/images/users/1.jpg" alt="user-img" class="img-circle"> <span>'+personas[i].nombre+'<small class="text-success">online</small></span></a> ';
    html +='</li> ';

  }
  divUsuarios.html(html);
}
function renderizarMensajes(mensaje, yo){
  var html = ''
  var fecha = new Date(mensaje.fecha);
  var hora = fecha.getHours()+':'+fecha.getMinutes();
  var adminClass =  'inverse';
  if(mensaje.nombre === 'administrador'){
    adminClass = 'danger';
  }
  if(yo){
    html += '<li> ';
    html += '    <div class="chat-img"><img src="assets/images/users/2.jpg" alt="user" /></div> ';
    html += '    <div class="chat-content"> ';
    html += '        <h5>'+mensaje.nombre+'</h5> ';
    html += '        <div class="box bg-light-info">'+mensaje.mensaje+'</div> ';
    html += '    </div> ';
    html += '    <div class="chat-time">'+hora+'</div> ';
    html += '</li> ';

  }else{
    html += '<li class="animated fadeIn reverse"> ';
    html += '    <div class="chat-content"> ';
    html += '        <h5>'+mensaje.nombre+'</h5> ';
    html += '        <div class="box bg-light-'+adminClass+'">'+mensaje.mensaje+'</div> ';
    html += '    </div> ';
    if(mensaje.nombre !== 'administrador'){
      html += '    <div class="chat-img"><img src="assets/images/users/5.jpg" alt="user" /></div> ';
    }
    html += '    <div class="chat-time">'+hora+'</div> ';
    html += '</li> ';
  }

  divChatbox.append(html);
}
function scrollBottom() {

    // selectors
    var newMessage = divChatbox.children('li:last-child');

    // heights
    var clientHeight = divChatbox.prop('clientHeight');
    var scrollTop = divChatbox.prop('scrollTop');
    var scrollHeight = divChatbox.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight() || 0;

    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        divChatbox.scrollTop(scrollHeight);
    }
}
// Listeners
divUsuarios.on('click','a',function(){
  var id = $(this).data('id');
  if(id){
    console.log(id);
  }
});

formEnviar.on('submit',function(e){
  e.preventDefault();
  if(txtMensaje.val().trim().length === 0){
    return
  }
  socket.emit('crearMensaje', {
      nombre: nombre,
      mensaje: txtMensaje.val()
  }, function(mensaje) {
      txtMensaje.val('').focus();
      renderizarMensajes(mensaje,true);
      scrollBottom();
  });


})
