using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;

namespace ProductsAPI.Models{
    public class ProductsContext:IdentityDbContext<AppUser, AppRole, int>
    {
        
        public ProductsContext(DbContextOptions<ProductsContext> options): base(options)
        {
            
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Category>().HasData(new Category{CategoryId =1, Name="Phone"});
            modelBuilder.Entity<Category>().HasData(new Category{CategoryId =2, Name="Computer"});

            
          
            
        }
        public DbSet<Product> Products { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<Favorite> Favorites { get; set; }
        public DbSet<Comment> Comments { get; set; }

    }
}