using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Speedy_Fingers.Entities;

namespace Speedy_Fingers.Data
{
    public class DataContext : IdentityDbContext<AppUser>
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options)
        {
        }

        public DbSet<Word> Words { get; set; }
        public DbSet<Competition> Competitions { get; set; }
        public DbSet<CompetitionRanking> Rankings { get; set; }
        public DbSet<Group> Groups { get; set; }
        public DbSet<Connection> Connections { get; set; }
        public DbSet<Matche> Matches { get; set; }
        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<Word>()
                .HasNoKey();

            builder.Entity<CompetitionRanking>()
                .HasKey(cr => new {cr.CompetitionId, cr.UserName});
        }
    }
}
