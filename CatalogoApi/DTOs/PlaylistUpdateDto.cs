using System.ComponentModel.DataAnnotations;

namespace CatalogoApi.DTOs
{
    public class PlaylistUpdateDto
    {
        [Required]
        public string Nome { get; set; } = string.Empty;
        public bool IsPublic { get; set; }
        public List<int> ItemIds { get; set; } = new List<int>();
    }
}
