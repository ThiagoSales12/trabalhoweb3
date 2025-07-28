using CatalogoApi.Data;
using CatalogoApi.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class PlaylistsController : ControllerBase
{
    private readonly ApiDbContext _context;

    public PlaylistsController(ApiDbContext context)
    {
        _context = context;
    }

    public class PlaylistCreateDto
    {
        public string Nome { get; set; } = string.Empty;
        public bool IsPublic { get; set; }
        public TipoPlaylist Tipo { get; set; }
        public List<int> ItemIds { get; set; } = new List<int>();
    }

    public class PlaylistUpdateDto
    {
        public string Nome { get; set; } = string.Empty;
        public bool IsPublic { get; set; }
        public List<int> ItemIds { get; set; } = new List<int>();
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Playlist>>> GetPlaylists()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        return await _context.Playlists
            .Where(p => p.UsuarioId == userId)
            .Include(p => p.Filmes)
            .Include(p => p.Livros)
            .ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Playlist>> GetPlaylist(int id)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var playlist = await _context.Playlists
            .Include(p => p.Filmes)
            .Include(p => p.Livros)
            .FirstOrDefaultAsync(p => p.Id == id && p.UsuarioId == userId);

        if (playlist == null)
        {
            return NotFound();
        }

        return playlist;
    }

    [HttpPost]
    public async Task<ActionResult<Playlist>> PostPlaylist(PlaylistCreateDto dto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId == null)
        {
            return Unauthorized();
        }

        var playlist = new Playlist
        {
            Nome = dto.Nome,
            IsPublic = dto.IsPublic,
            UsuarioId = userId,
            Tipo = dto.Tipo
        };

        if (dto.Tipo == TipoPlaylist.Filmes)
        {
            var filmes = await _context.Filmes.Where(f => dto.ItemIds.Contains(f.Id)).ToListAsync();
            playlist.Filmes = filmes;
        }
        else
        {
            var livros = await _context.Livros.Where(l => dto.ItemIds.Contains(l.Id)).ToListAsync();
            playlist.Livros = livros;
        }

        _context.Playlists.Add(playlist);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetPlaylist), new { id = playlist.Id }, playlist);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> PutPlaylist(int id, PlaylistUpdateDto dto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var playlist = await _context.Playlists
            .Include(p => p.Filmes)
            .Include(p => p.Livros)
            .FirstOrDefaultAsync(p => p.Id == id && p.UsuarioId == userId);

        if (playlist == null)
        {
            return NotFound();
        }

        playlist.Nome = dto.Nome;
        playlist.IsPublic = dto.IsPublic;

        if (playlist.Tipo == TipoPlaylist.Filmes)
        {
            playlist.Filmes.Clear();
            var filmes = await _context.Filmes.Where(f => dto.ItemIds.Contains(f.Id)).ToListAsync();
            playlist.Filmes = filmes;
        }
        else
        {
            playlist.Livros.Clear();
            var livros = await _context.Livros.Where(l => dto.ItemIds.Contains(l.Id)).ToListAsync();
            playlist.Livros = livros;
        }

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!_context.Playlists.Any(e => e.Id == id))
            {
                return NotFound();
            }
            else
            {
                throw;
            }
        }

        return NoContent();
    }
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeletePlaylist(int id)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var playlist = await _context.Playlists.FirstOrDefaultAsync(p => p.Id == id && p.UsuarioId == userId);

        if (playlist == null)
        {
            return NotFound();
        }

        _context.Playlists.Remove(playlist);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
