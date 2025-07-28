using System.ComponentModel.DataAnnotations;

namespace CatalogoApi.DTOs
{
    public class LivroCreateUpdateDto
    {
        [Required]
        public string Titulo { get; set; } = string.Empty;
        public string? Autor { get; set; }
        public int Ano { get; set; }
        public string? UrlCapa { get; set; }
    }
}
