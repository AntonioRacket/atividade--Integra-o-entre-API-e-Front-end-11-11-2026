namespace MinhaBiblioteca.Models;

public class Livro : MaterialBiblioteca, IEmprestimo
{
    public string Autor { get; set; } = string.Empty;
    public int Paginas { get; set; }

    public override int CalcularPrazo()
    {
        return 14;
    }

    public override string Descricao()
    {
        return $"Livro: {Titulo} - Autor: {Autor}";
    }

    public string Emprestar()
    {
        return $"O livro '{Titulo}' pode ser emprestado por {CalcularPrazo()} dias.";
    }
}