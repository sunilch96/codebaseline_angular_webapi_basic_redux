using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System.Reflection.Emit;

namespace CodeBaseline.Data.Entities
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUserEntity>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }
        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
            new DbInitializer(builder).Seed();
        }

        public DbSet<PostsEntity> Posts { get; set; }
        public DbSet<MenuSubMenuEntity> MenuSubMenu { get; set; }
        public DbSet<CourseTilesEntity> CourseTiles { get; set; }
        public DbSet<CategoriesEntity> Categories { get; set; }
        public DbSet<MediaEntity> Media  { get; set; }
    }
}
