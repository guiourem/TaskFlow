
const formulario = document.getElementById("form-tarefa");
const campoTitulo = document.getElementById("titulo");
const campoDescricao = document.getElementById("descricao");
const listaTarefas = document.getElementById("tarefas");
const mensagemVazia = document.getElementById("mensagem-vazia");
const filtro = document.getElementById("filtro");
const totalTarefas = document.getElementById("total-tarefas");
const totalPendentes = document.getElementById("total-pendentes");
const totalConcluidas = document.getElementById("total-concluidas");
const barraProgresso = document.getElementById("barra-progresso");
const porcentagemProgresso = document.getElementById("porcentagem-progresso");


function atualizarResumo() {
    const total = tarefas.length;

    const concluidas = tarefas.filter(function(tarefa) {
        return tarefa.concluida;
    }).length;

    const pendentes = total - concluidas;

    totalTarefas.textContent = total;
    totalPendentes.textContent = pendentes;
    totalConcluidas.textContent = concluidas;

    let porcentagem = 0;

    if (total > 0) {
        porcentagem = Math.round((concluidas / total) * 100);
    }

    barraProgresso.style.width = porcentagem + "%";
    porcentagemProgresso.textContent = porcentagem + "%";
}

let tarefas = [];
let filtroAtual = "todas";

// Salvar tarefas no navegador
function salvarTarefas() {
    localStorage.setItem(
        "taskflow-tarefas",
        JSON.stringify(tarefas)
    );
}

// Cadastrar uma nova tarefa
function cadastrarTarefa(evento) {
    evento.preventDefault();

    const titulo = campoTitulo.value.trim();
    const descricao = campoDescricao.value.trim();

    if (titulo === "") {
        alert("Digite um título para a tarefa.");
        return;
    }

    const novaTarefa = {
        id: Date.now(),
        titulo: titulo,
        descricao: descricao,
        concluida: false
    };

    tarefas.push(novaTarefa);

    salvarTarefas();
    renderizarTarefas();

    formulario.reset();
    campoTitulo.focus();
}


function renderizarTarefas() {
    listaTarefas.innerHTML = "";
    atualizarResumo();

    const tarefasFiltradas = tarefas.filter(function(tarefa) {
        if (filtroAtual === "pendentes") {
            return !tarefa.concluida;
        }

        if (filtroAtual === "concluidas") {
            return tarefa.concluida;
        }

        return true;
    });

    mensagemVazia.textContent = tarefas.length === 0
        ? "Nenhuma tarefa cadastrada ainda."
        : "Nenhuma tarefa encontrada neste filtro.";

    mensagemVazia.hidden = tarefasFiltradas.length > 0;

    tarefasFiltradas.forEach(function(tarefa) {
        const item = document.createElement("li");
        item.className = "item-tarefa";

        const conteudo = document.createElement("div");
        conteudo.className = "conteudo-tarefa";

        const titulo = document.createElement("h3");
        titulo.textContent = tarefa.titulo;

        if (tarefa.concluida) {
            titulo.classList.add("tarefa-concluida");
        }

        conteudo.appendChild(titulo);

        if (tarefa.descricao !== "") {
            const descricao = document.createElement("p");
            descricao.textContent = tarefa.descricao;
            conteudo.appendChild(descricao);
        }

        const status = document.createElement("span");
        status.className = tarefa.concluida
            ? "status concluida"
            : "status pendente";

        status.textContent = tarefa.concluida
            ? "Concluída"
            : "Pendente";

        conteudo.appendChild(status);

        const acoes = document.createElement("div");
        acoes.className = "acoes-tarefa";

        const botaoConcluir = document.createElement("button");
        botaoConcluir.type = "button";
        botaoConcluir.className = "btn-concluir";
        botaoConcluir.textContent = tarefa.concluida
            ? "Reabrir"
            : "Concluir";

        botaoConcluir.addEventListener("click", function() {
            alternarConclusao(tarefa.id);
        });

        const botaoExcluir = document.createElement("button");
        botaoExcluir.type = "button";
        botaoExcluir.className = "btn-excluir";
        botaoExcluir.textContent = "Excluir";

        botaoExcluir.addEventListener("click", function() {
            excluirTarefa(tarefa.id);
        });

        acoes.appendChild(botaoConcluir);
        acoes.appendChild(botaoExcluir);

        item.appendChild(conteudo);
        item.appendChild(acoes);

        listaTarefas.appendChild(item);
    });
}

// Concluir ou reabrir tarefa
function alternarConclusao(id) {
    const tarefa = tarefas.find(function(item) {
        return item.id === id;
    });

    if (tarefa) {
        tarefa.concluida = !tarefa.concluida;
        salvarTarefas();
        renderizarTarefas();
    }
}

// Excluir tarefa
function excluirTarefa(id) {
    tarefas = tarefas.filter(function(tarefa) {
        return tarefa.id !== id;
    });

    salvarTarefas();
    renderizarTarefas();
}

// Alterar filtro
filtro.addEventListener("change", function() {
    filtroAtual = filtro.value;
    renderizarTarefas();
});

// Recuperar tarefas salvas
function carregarTarefas() {
    const dadosSalvos = localStorage.getItem("taskflow-tarefas");

    if (dadosSalvos !== null) {
        try {
            const tarefasSalvas = JSON.parse(dadosSalvos);

            if (Array.isArray(tarefasSalvas)) {
                tarefas = tarefasSalvas;
            }
        } catch (erro) {
            console.error("Erro ao carregar tarefas:", erro);
        }
    }

    renderizarTarefas();
}

// Iniciar o sistema
formulario.addEventListener("submit", cadastrarTarefa);
carregarTarefas();