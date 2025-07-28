using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CatalogoApi.Models
{
    public enum TipoPlaylist
    {
        Filmes,
        Livros
    }
    public class Playlist
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public string Nome { get; set; }
        public bool IsPublic { get; set; } = false;
        [Required]
        public TipoPlaylist Tipo { get;set; }
        [Required]
        public string UsuarioId { get; set; }
        [ForeignKey("UsuarioId")]
        public Usuario? Criador { get; set; }
        public ICollection<Filme> Filmes { get; set; } = new List<Filme>();
        public ICollection<Livro> Livros { get; set; } = new List<Livro>();
    }
}
