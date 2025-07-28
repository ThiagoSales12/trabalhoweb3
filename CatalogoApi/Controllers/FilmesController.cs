using CatalogoApi.Data;
using CatalogoApi.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class FilmesController : ControllerBase
{
    private readonly ApiDbContext _context;

    public FilmesController(ApiDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Filme>>> GetFilmes()
    {
        return await _context.Filmes.ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Filme>> GetFilme(int id)
    {
        var filme = await _context.Filmes.FindAsync(id);

        if (filme == null)
        {
            return NotFound();
        }

        return filme;
    }

    [HttpPost]
    public async Task<ActionResult<Filme>> PostFilme(Filme filme)
    {
        _context.Filmes.Add(filme);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetFilme), new { id = filme.Id }, filme);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> PutFilme(int id, Filme filme)
    {
        if (id != filme.Id)
        {
            return BadRequest();
        }

        _context.Entry(filme).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!_context.Filmes.Any(e => e.Id == id))
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
    public async Task<IActionResult> DeleteFilme(int id)
    {
        var filme = await _context.Filmes.FindAsync(id);
        if (filme == null)
        {
            return NotFound();
        }

        _context.Filmes.Remove(filme);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}