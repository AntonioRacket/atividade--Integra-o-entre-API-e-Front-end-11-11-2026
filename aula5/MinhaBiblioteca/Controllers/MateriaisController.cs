using Microsoft.AspNetCore.Mvc;
using MinhaBiblioteca.Models;
using MinhaBiblioteca.Repositories;

namespace MinhaBiblioteca.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MateriaisController : ControllerBase
{
    private readonly IMaterialRepository _repository;

    public MateriaisController(IMaterialRepository repository)
    {
        _repository = repository;
    }

    private string? ValidarMaterial(MaterialBiblioteca material)
    {
        if (string.IsNullOrWhiteSpace(material.Titulo))
            return "O título é obrigatório.";

        if (material.AnoPublicacao < 0)
            return "O ano de publicação não pode ser menor que 0.";

        return null;
    }

    private string? ValidarLivro(Livro livro)
    {
        var erro = ValidarMaterial(livro);
        if (erro != null)
            return erro;

        if (string.IsNullOrWhiteSpace(livro.Autor))
            return "O autor é obrigatório.";

        if (livro.Paginas <= 0)
            return "O número de páginas deve ser maior que 0.";

        return null;
    }

    private string? ValidarRevista(Revista revista)
    {
        var erro = ValidarMaterial(revista);
        if (erro != null)
            return erro;

        if (revista.Edicao <= 0)
            return "A edição deve ser maior que 0.";

        if (revista.MesPublicacao < 1 || revista.MesPublicacao > 12)
            return "O mês de publicação deve estar entre 1 e 12.";

        return null;
    }

    [HttpGet]
    public IActionResult ObterTodos()
    {
        return Ok(_repository.ObterTodos().Cast<object>());
    }

    [HttpGet("{id}")]
    public IActionResult ObterPorId(int id)
    {
        var material = _repository.ObterPorId(id);

        if (material == null)
            return NotFound();

        return Ok(material);
    }

    [HttpPost("livro")]
    public IActionResult CadastrarLivro(Livro livro)
    {
        var erro = ValidarLivro(livro);
        if (erro != null)
            return BadRequest(erro);

        var criado = _repository.Adicionar(livro);
        return CreatedAtAction(nameof(ObterPorId), new { id = criado.Id }, criado);
    }

    [HttpPost("revista")]
    public IActionResult CadastrarRevista(Revista revista)
    {
        var erro = ValidarRevista(revista);
        if (erro != null)
            return BadRequest(erro);

        var criado = _repository.Adicionar(revista);
        return CreatedAtAction(nameof(ObterPorId), new { id = criado.Id }, criado);
    }

    [HttpPut("livro/{id}")]
    public IActionResult AtualizarLivro(int id, Livro livro)
    {
        var erro = ValidarLivro(livro);
        if (erro != null)
            return BadRequest(erro);

        if (!_repository.Atualizar(id, livro))
            return NotFound();

        return Ok(livro);
    }

    [HttpPut("revista/{id}")]
    public IActionResult AtualizarRevista(int id, Revista revista)
    {
        var erro = ValidarRevista(revista);
        if (erro != null)
            return BadRequest(erro);

        if (!_repository.Atualizar(id, revista))
            return NotFound();

        return Ok(revista);
    }

    [HttpDelete("{id}")]
    public IActionResult Remover(int id)
    {
        if (!_repository.Remover(id))
            return NotFound();

        return NoContent();
    }

    [HttpGet("{id}/descricao")]
    public IActionResult ObterDescricao(int id)
    {
        var material = _repository.ObterPorId(id);

        if (material == null)
            return NotFound();

        return Ok(new
        {
            id = material.Id,
            tipo = material.GetType().Name,
            descricao = material.Descricao(),
            prazoEmprestimo = material.CalcularPrazo()
        });
    }

    [HttpPost("{id}/emprestar")]
    public IActionResult Emprestar(int id)
    {
        var material = _repository.ObterPorId(id);

        if (material == null)
            return NotFound();

        if (material is not IEmprestimo emprestimo)
            return BadRequest("Este material não pode ser emprestado.");

        return Ok(emprestimo.Emprestar());
    }
}