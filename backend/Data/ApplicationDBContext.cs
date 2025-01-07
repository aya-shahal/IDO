using Microsoft.EntityFrameworkCore;
using backend.Models;

namespace backend.Data
{
    public class ApplicationDBContext : DbContext
    {
        public ApplicationDBContext(DbContextOptions dbContextOptions)
            : base(dbContextOptions)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<ToDo> ToDo { get; set; }

        // Optionally override the OnConfiguring method if you want to configure the database connection here
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                optionsBuilder.UseNpgsql("Host=localhost;Port=5432;Username=postgres;Password=mysecretpassword;Database=TodoDb;");
            }
        }
    }
}
