using Microsoft.EntityFrameworkCore;
using CatalogoApi.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;

namespace CatalogoApi.Data
{
    public class ApiDbContext : IdentityDbContext<Usuario>
    {
        public ApiDbContext(DbContextOptions<ApiDbContext> options) : base(options)
        {
        }

        public DbSet<Filme> Filmes { get; set; }
        public DbSet<Livro> Livros { get; set; }
        public DbSet<Playlist> Playlists { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Playlist>()
                .HasMany(p => p.Filmes)
                .WithMany(f => f.Playlists)
                .UsingEntity(j => j.ToTable("PlaylistFilme"));

            modelBuilder.Entity<Playlist>()
                .HasMany(p => p.Livros)
                .WithMany(l => l.Playlists)
                .UsingEntity(j => j.ToTable("PlaylistLivro"));
        }
    }
}