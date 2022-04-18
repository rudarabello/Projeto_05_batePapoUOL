
let usuario = {
  name: "",
};

let ultimaMensagem;

function entrarNaSala() {
  usuario.name = document.querySelector(".initial form input").value;

  let promise = axios.post(
    "https://mock-api.driven.com.br/api/v6/uol/participants",
    usuario
  );

  promise.then(function (response) {
    let login = document.querySelector(".initial");
    let form = document.querySelector(".initial form");
    let loading = document.querySelector(".loading");

    loading.classList.remove("none");
    form.classList.add("none");

    setTimeout(function () {
      login.classList.add("none");
      manterConexao();
      pegarMensagens();
    }, 4000);
  });

  promise.catch(function (error) {
    if (error.response.status === 400) {
      let input = document.querySelector(".initial form input");
      input.value = "";
      alert(`${usuario.name} já está em uso! Por favor insira outro nome para Login`)
    }
  });
}

function manterConexao() {
  setInterval(function () {
    let promise = axios.post(
      "https://mock-api.driven.com.br/api/v6/uol/status",
      usuario
    );
  }, 5000);
}

function render(body, message) {
  if (message.type === "status") {
    body.innerHTML += `
            <div class="messages alert">
                <p class="message-line"><span class="time">(${message.time})</span><span class="name">${message.from}</span>${message.text}</p>
            </div>`;
  } else if (message.type === "message") {
    body.innerHTML += `
            <div class="messages">
                <p class="message-line"><span class="time">(${message.time})</span><span class="name">${message.from}</span> para <span class="receiver">${message.to}: </span><span class="text">${message.text}</span></p>
            </div>`;
  } else if (message.type === "private_message") {
    body.innerHTML += `
            <div class="messages private">
                <p class="message-line"><span class="time">(${message.time})</span><span class="name">${message.from}</span>para  <span class="receiver">${message.to}: </span><span class="text">${message.text}</span></p>
            </div>`;
  }
}



function scrollBottom() {
  let messages = document.querySelectorAll(".messages");
  messages[messages.length - 1].scrollIntoView();
}

function renderizaMensagens(response) {
  let body = document.querySelector(".body");
  for (let i = 0; i < response.data.length; i++) {
    let message = response.data[i];
    render(body, message);
  }
  scrollBottom();
  ultimaMensagem = response.data[99];
}

function comparaMensagens(m1, m2) {
  if (
    m1.from === m2.from &&
    m1.to === m2.to &&
    m1.text === m2.text &&
    m1.type === m2.type &&
    m1.time === m2.time
  ) {
    return true;
  }
  return false;
}


function renderizaUltimaMensagem(response) {
  if (!comparaMensagens(response.data[99], ultimaMensagem)) {
    let body = document.querySelector(".body");
    let message = response.data[99];
    render(body, message);
  }
  ultimaMensagem = response.data[99];
  scrollBottom();
}

function pegarMensagens() {
  let promise = axios.get("https://mock-api.driven.com.br/api/v6/uol/messages");
  promise.then(renderizaMensagens);

  setInterval(function () {
    promise = axios.get("https://mock-api.driven.com.br/api/v6/uol/messages");
    promise.then(renderizaUltimaMensagem);
  }, 3000);

}

function scrollBottom() {
  let messages = document.querySelectorAll(".messages");
  messages[messages.length - 1].scrollIntoView();
}

function enviarMensagem() {
  let messagetosend = document.querySelector(".messagebox input");

  let mensagem = {
    from: usuario.name,
    to: "Todos",
    text: messagetosend.value,
    type: "message",
  };

  let promise = axios.post(
    "https://mock-api.driven.com.br/api/v6/uol/messages",
    mensagem
  );

  promise.then(function (response) {
    pegarMensagens();
  });

  promise.catch(function (error) {
    window.location.reload();
  });

  messagetosend.value = "";
  messagetosend.focus();
}