using CatalogoApi.Models;
using System.ComponentModel.DataAnnotations;

namespace CatalogoApi.DTOs
{
    public class PlaylistCreateDto
    {
        [Required]
        public string Nome { get; set; } = string.Empty;
        public bool IsPublic { get; set; }
        [Required]
        public TipoPlaylist Tipo { get; set; }
        public List<int> ItemIds { get; set; } = new List<int>();
    }
}
