var socket = io();

var messages = document.getElementById('messages');
var form = document.getElementById('form');
var input = document.getElementById('input');
var no = document.getElementById('no');


axios.get("/old-messages")
    .then(r=>{
        r.data.result.map(ele=>{
            var item = document.createElement('li');
            item.textContent = `${ele.user} 號朋友說 : ${ele.messages} (${ele.created_at})` ;
            messages.appendChild(item);
        })
       
        // console.log(data);
    })
    .catch(err=>{
        console.log(err);
    });

form.addEventListener('submit', function(e) {
    e.preventDefault();
    if (input.value) {
        socket.emit('chat message', { value : input.value , no : Number(no.value) });
        console.log(input.value);
        input.value = '';
    }
});

socket.on('end user message',function(msg){
    var item = document.createElement("li");
    item.textContent = `${msg.no} 號朋友說 : ${msg.value}` ;
    messages.appendChild(item);
    window.scrollTo(0,document.body.scrollHeight)
});