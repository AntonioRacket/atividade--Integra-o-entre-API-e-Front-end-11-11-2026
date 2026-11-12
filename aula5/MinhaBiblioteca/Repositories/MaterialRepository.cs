using MinhaBiblioteca.Models;

namespace MinhaBiblioteca.Repositories;

public class MaterialRepository : IMaterialRepository
{
    private readonly Dictionary<int, MaterialBiblioteca> _materiais = new();
    private int _ultimoId = 0;

    public MaterialRepository()
    {
        Adicionar(new Livro
        {
            Titulo = "Clean Code",
            AnoPublicacao = 2008,
            Autor = "Robert C. Martin",
            Paginas = 464
        });

        Adicionar(new Revista
        {
            Titulo = "Tecnologia e Inovação",
            AnoPublicacao = 2025,
            Edicao = 15,
            MesPublicacao = 6
        });
    }

    private int GerarNovoId()
    {
        _ultimoId++;
        return _ultimoId;
    }

    public IEnumerable<MaterialBiblioteca> ObterTodos()
    {
        return _materiais.Values;
    }

    public MaterialBiblioteca? ObterPorId(int id)
    {
        if (!_materiais.ContainsKey(id))
            return null;

        return _materiais[id];
    }

    public MaterialBiblioteca Adicionar(MaterialBiblioteca material)
    {
        material.Id = GerarNovoId();
        _materiais.Add(material.Id, material);
        return material;
    }

    public bool Atualizar(int id, MaterialBiblioteca material)
    {
        if (!_materiais.ContainsKey(id))
            return false;

        material.Id = id;
        _materiais[id] = material;
        return true;
    }

    public bool Remover(int id)
    {
        return _materiais.Remove(id);
    }
}
