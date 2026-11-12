const API_URL = "https://localhost:7161/api/Materiais";

const mensagem = document.querySelector("#mensagem");
const corpoTabela = document.querySelector("#corpoTabela");
const form = document.querySelector("#form");
const tipo = document.querySelector("#tipo");
const camposLivro = document.querySelector("#camposLivro");
const camposRevista = document.querySelector("#camposRevista");
const btnSalvar = document.querySelector("#btnSalvar");

let materiais = [];
let editandoId = null;

const valor = id => document.querySelector("#" + id).value.trim();
const numero = id => valor(id) === "" ? NaN : Number(valor(id));

function mostrarMensagem(texto, cor) {
    mensagem.textContent = texto;
    mensagem.className = `alert alert-${cor}`;
}

function ehLivro(material) {
    return material.autor !== undefined;
}

function detalhes(material) {
    if (ehLivro(material)) return `Autor: ${material.autor}, ${material.paginas} páginas`;
    return `Edição ${material.edicao}, mês ${material.mesPublicacao}`;
}

async function chamarApi(caminho, metodo = "GET", corpo = null) {
    const opcoes = { method: metodo };

    if (corpo) {
        opcoes.headers = { "Content-Type": "application/json" };
        opcoes.body = JSON.stringify(corpo);
    }

    return await fetch(API_URL + caminho, opcoes);
}

async function lerErro(response) {
    const texto = await response.text();

    try {
        const json = JSON.parse(texto);
        return Object.values(json.errors || {}).flat().join(" ") || json.title || texto;
    } catch {
        return texto || `Erro ${response.status}`;
    }
}

function botao(texto, cor, aoClicar) {
    const b = document.createElement("button");
    b.type = "button";
    b.className = `btn btn-sm btn-outline-${cor}`;
    b.textContent = texto;
    b.addEventListener("click", async () => {
        try {
            await aoClicar();
        } catch {
            mostrarMensagem("Erro ao conectar com a API.", "danger");
        }
    });
    return b;
}

function renderizar() {
    corpoTabela.replaceChildren();

    const livros = materiais.filter(ehLivro).length;
    document.querySelector("#total").textContent = materiais.length;
    document.querySelector("#totalLivros").textContent = livros;
    document.querySelector("#totalRevistas").textContent = materiais.length - livros;
    document.querySelector("#textoVazio").classList.toggle("d-none", materiais.length > 0);

    materiais.forEach(material => {
        const linha = corpoTabela.insertRow();
        linha.insertCell().textContent = material.id;
        linha.insertCell().textContent = ehLivro(material) ? "Livro" : "Revista";
        linha.insertCell().textContent = material.titulo;
        linha.insertCell().textContent = material.anoPublicacao;
        linha.insertCell().textContent = detalhes(material);

        const acoes = linha.insertCell();
        acoes.className = "acoes";
        acoes.append(
            botao("Consultar", "primary", () => consultar(material.id)),
            botao("Descrição", "info", () => descricao(material.id)),
            botao("Emprestar", "success", () => emprestar(material.id)),
            botao("Editar", "warning", () => editar(material)),
            botao("Excluir", "danger", () => excluir(material.id))
        );
    });
}

async function carregarMateriais() {
    try {
        const response = await chamarApi("");
        if (!response.ok) throw new Error();
        materiais = await response.json();
    } catch {
        materiais = [];
        mostrarMensagem("Não foi possível carregar os materiais.", "danger");
    }

    renderizar();
}

async function consultar(id) {
    const response = await chamarApi(`/${id}`);

    if (response.status === 404) {
        mostrarMensagem("Material não encontrado.", "warning");
        return;
    }

    const material = await response.json();
    mostrarMensagem(
        `ID: ${material.id}\nTipo: ${ehLivro(material) ? "Livro" : "Revista"}\nTítulo: ${material.titulo}\nAno: ${material.anoPublicacao}\n${detalhes(material)}`,
        "info"
    );
}

async function descricao(id) {
    const response = await chamarApi(`/${id}/descricao`);

    if (response.status === 404) {
        mostrarMensagem("Material não encontrado.", "warning");
        return;
    }

    const dados = await response.json();
    mostrarMensagem(
        `Tipo: ${dados.tipo}\nDescrição: ${dados.descricao}\nPrazo de empréstimo: ${dados.prazoEmprestimo} dias`,
        "info"
    );
}

async function emprestar(id) {
    const response = await chamarApi(`/${id}/emprestar`, "POST");

    if (response.status === 404) {
        mostrarMensagem("Material não encontrado.", "warning");
    } else if (response.ok) {
        mostrarMensagem(await response.text(), "success");
    } else {
        mostrarMensagem(await lerErro(response), "danger");
    }
}

async function excluir(id) {
    if (!confirm("Deseja excluir este material?")) return;

    const response = await chamarApi(`/${id}`, "DELETE");

    if (response.status === 404) {
        mostrarMensagem("Material não encontrado.", "warning");
    } else if (response.ok) {
        mostrarMensagem("Material excluído com sucesso!", "success");
    } else {
        mostrarMensagem(await lerErro(response), "danger");
        return;
    }

    await carregarMateriais();
}

function trocarTipo() {
    camposLivro.classList.toggle("d-none", tipo.value !== "livro");
    camposRevista.classList.toggle("d-none", tipo.value !== "revista");
}

function limparFormulario() {
    form.reset();
    editandoId = null;
    tipo.disabled = false;
    btnSalvar.textContent = "Cadastrar";
    trocarTipo();
}

function editar(material) {
    const livro = ehLivro(material);

    editandoId = material.id;
    tipo.value = livro ? "livro" : "revista";
    tipo.disabled = true;
    trocarTipo();

    document.querySelector("#titulo").value = material.titulo;
    document.querySelector("#ano").value = material.anoPublicacao;

    if (livro) {
        document.querySelector("#autor").value = material.autor;
        document.querySelector("#paginas").value = material.paginas;
    } else {
        document.querySelector("#edicao").value = material.edicao;
        document.querySelector("#mes").value = material.mesPublicacao;
    }

    btnSalvar.textContent = "Salvar alterações";
    form.scrollIntoView();
}

function validar(tipoMaterial, dados) {
    if (dados.titulo === "") return "Informe o título.";
    if (!Number.isInteger(dados.anoPublicacao) || dados.anoPublicacao < 0)
        return "Informe um ano válido (0 ou maior).";

    if (tipoMaterial === "livro") {
        if (dados.autor === "") return "Informe o autor.";
        if (!Number.isInteger(dados.paginas) || dados.paginas <= 0)
            return "As páginas devem ser maiores que 0.";
    } else {
        if (!Number.isInteger(dados.edicao) || dados.edicao <= 0)
            return "A edição deve ser maior que 0.";
        if (!Number.isInteger(dados.mesPublicacao) || dados.mesPublicacao < 1 || dados.mesPublicacao > 12)
            return "O mês deve estar entre 1 e 12.";
    }

    return null;
}

form.addEventListener("submit", async evento => {
    evento.preventDefault();

    const tipoMaterial = tipo.value;
    const dados = { titulo: valor("titulo"), anoPublicacao: numero("ano") };

    if (tipoMaterial === "livro") {
        dados.autor = valor("autor");
        dados.paginas = numero("paginas");
    } else {
        dados.edicao = numero("edicao");
        dados.mesPublicacao = numero("mes");
    }

    const erro = validar(tipoMaterial, dados);
    if (erro) {
        mostrarMensagem(erro, "warning");
        return;
    }

    const editando = editandoId !== null;
    const caminho = editando ? `/${tipoMaterial}/${editandoId}` : `/${tipoMaterial}`;

    try {
        const response = await chamarApi(caminho, editando ? "PUT" : "POST", dados);

        if (response.status === 404) {
            mostrarMensagem("Material não encontrado.", "warning");
        } else if (response.ok) {
            mostrarMensagem(editando ? "Material atualizado com sucesso!" : "Material cadastrado com sucesso!", "success");
        } else {
            mostrarMensagem(await lerErro(response), "danger");
            return;
        }

        limparFormulario();
        await carregarMateriais();
    } catch {
        mostrarMensagem("Erro ao conectar com a API.", "danger");
    }
});

tipo.addEventListener("change", trocarTipo);
document.querySelector("#btnCancelar").addEventListener("click", limparFormulario);

trocarTipo();
carregarMateriais();