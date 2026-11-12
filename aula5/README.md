# Biblioteca Universitária - Web API

## Integrantes

Antonio Raquita 114.060
Caio Fernandes Neves 114.031
Pedro Fregadolli Kawahata Barreto 114.046
Paulo Serrat

## Descrição do sistema

Web API para cadastrar, listar, buscar, atualizar e excluir livros e revistas do acervo de uma biblioteca universitária. Os dados ficam apenas em memória.

## Tecnologias utilizadas

- C#
- ASP.NET Core Web API 
- Swagger (Swashbuckle)

## Como executar

```bash
git clone LINK_DO_REPOSITORIO
cd MinhaBiblioteca
dotnet run
```

Acesse `https://localhost:PORTA/swagger`, trocando `PORTA` pela porta exibida no terminal.

## Principais endpoints

| Método | URL | Função |
|---|---|---|
| GET | /api/Materiais | Lista todos |
| GET | /api/Materiais/{id} | Busca por ID |
| POST | /api/Materiais/livro | Cadastra livro |
| POST | /api/Materiais/revista | Cadastra revista |
| PUT | /api/Materiais/livro/{id} | Atualiza livro |
| PUT | /api/Materiais/revista/{id} | Atualiza revista |
| DELETE | /api/Materiais/{id} | Exclui material |
| GET | /api/Materiais/{id}/descricao | Descrição e prazo |
| POST | /api/Materiais/{id}/emprestar | Tenta emprestar |

## Exemplos de testes

Livro:

```json
{
  "titulo": "O Programador Pragmático",
  "anoPublicacao": 1999,
  "autor": "Andrew Hunt",
  "paginas": 352
}
```

Revista:

```json
{
  "titulo": "Revista de Tecnologia",
  "anoPublicacao": 2026,
  "edicao": 20,
  "mesPublicacao": 11
}


