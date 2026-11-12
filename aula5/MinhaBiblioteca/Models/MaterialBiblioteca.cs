namespace MinhaBiblioteca.Models;

public abstract class MaterialBiblioteca
{
    public int Id { get; set; }
    public string Titulo { get; set; } = string.Empty;
    public int AnoPublicacao { get; set; }

    public abstract int CalcularPrazo();

    public virtual string Descricao()
    {
        return $"Material: {Titulo}";
    }
}