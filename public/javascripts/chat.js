const msgerForm = get(".msger-inputarea");
const msgerInput = get(".msger-input");
const msgerChat = get(".msger-chat");
const typing = document.getElementById('typing')
const online = document.getElementById('online')
let FRIEND_IMG, FRIEND_NAME, PERSON_IMG, PERSON_NAME
const { from, to } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});
let threadId;
fetch(`/inbox/getdata/${to}`).then(res => res.json()).then(res => { FRIEND_IMG = res.pic, FRIEND_NAME = res.name })
fetch(`/inbox/getdata/${from}`).then(res => res.json()).then(res => { PERSON_IMG = res.pic, PERSON_NAME = res.name })

// Icons made by Freepik from www.flaticon.com
const socket = io();
socket.emit('joinRoom', { from, to })
socket.emit('isonline', { uid: to })

socket.on('getThreadId', data => {
    threadId = data.threadId
    fetch(`/inbox/message/${data.threadId}/${from}`).then((data => data.json())).then(data => {
        data.chats.forEach(msg => {
            if (msg.from == from) {
                appendMessage(PERSON_NAME, PERSON_IMG, 'right', msg.text, msg.time)
            } else {
                appendMessage(FRIEND_NAME, FRIEND_IMG, 'left', msg.text, msg.time)
            }
        });
    })

});


socket.on('message', message => {

    if (message.from == from)
        appendMessage(PERSON_NAME, PERSON_IMG, 'right', message.text, message.time)
    else
        appendMessage(FRIEND_NAME, FRIEND_IMG, 'left', message.text, message.time)
});

socket.on('heistyping', () => {
    typing.textContent = "...typing"
})
socket.on('heisstop', () => {
    typing.textContent = ""
})
socket.on('heisonline', () => {
    online.textContent = "Online"
})
socket.on('heisoffline', (obj) => {
    if (obj.uid == to) {
        online.textContent = ""
        typing.textContent = ""
    }
})


msgerForm.addEventListener("submit", event => {
    event.preventDefault();

    const msgText = msgerInput.value;
    if (!msgText) return;

    let message = {
        thread: threadId,
        from: from,
        to: to,
        name: PERSON_NAME,
        time: formatTime(new Date(Date())),
        text: msgText,
    }
    socket.emit('chatMessage', message);
    msgerInput.value = ''
    msgerInput.focus()
});

msgerInput.addEventListener('focus', () => {
    socket.emit('iamtyping', { user: to })
})
msgerInput.addEventListener('blur', () => {
    socket.emit('iamstop', { user: to })
})

function appendMessage(name, img, side, text, time) {
    //   Simple solution for small apps
    const msgHTML = `
    <div class="msg ${side}-msg">
      <div class="msg-img" style="background-image: url(${img})"></div>

      <div class="msg-bubble">
        <div class="msg-info">
          <div class="msg-info-name">${name}</div>
          <div class="msg-info-time">${time}</div>
        </div>

        <div class="msg-text">${text}</div>
      </div>
    </div>
  `;

    msgerChat.insertAdjacentHTML("beforeend", msgHTML);
    msgerChat.scrollTop += 500;
}

// Utils
function get(selector, root = document) {
    return root.querySelector(selector);
}
function formatTime(time) {

    let h = time.getHours()
    let min = time.getMinutes()
    let d = time.getDate()
    let m = time.getMonth() + 1

    switch (m) {
        case 1: m = 'Jan'; break;
        case 2: m = 'Feb'; break;
        case 3: m = 'Mar'; break;
        case 4: m = 'Apr'; break;
        case 5: m = 'May'; break;
        case 6: m = 'Jun'; break;
        case 7: m = 'Jul'; break;
        case 8: m = 'Aug'; break;
        case 9: m = 'Sep'; break;
        case 10: m = 'Oct'; break;
        case 11: m = 'Nov'; break;
        case 12: m = 'Dec'; break;
    }

    return result = `${h}:${min} on ${d} ${m}`
}