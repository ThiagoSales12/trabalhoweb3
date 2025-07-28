using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CatalogoApi.Models
{
    public class Filme
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public string Titulo { get; set; } = string.Empty;
        public string? Autor { get; set; }
        public int Ano { get; set; }
        public string? UrlCapa { get; set; }

        public ICollection<Playlist> Playlists { get; set; } = new List<Playlist>();
    }
}
