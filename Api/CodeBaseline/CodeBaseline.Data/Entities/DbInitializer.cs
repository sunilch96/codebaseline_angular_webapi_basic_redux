using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CodeBaseline.Data.Entities
{
    public class DbInitializer
    {
        private readonly ModelBuilder modelBuilder;

        public DbInitializer(ModelBuilder modelBuilder)
        {
            this.modelBuilder = modelBuilder;
        }

        public void Seed()
        {
            modelBuilder.Entity<CategoriesEntity>().HasData(
                   new CategoriesEntity() {
                       Id= 1,
                       CategoryName = "CourseMenu",
                       CategoryDescription= "Contains Courses Related Menus",
                       GroupName = "Menu"
                   },
                   new CategoriesEntity()
                   {
                       Id= 2,
                       CategoryName = "HomeMenu",
                       CategoryDescription = "Contains Home Menus",
                       GroupName = "Menu"
                   },
                   new CategoriesEntity()
                   {
                       Id= 3,
                       CategoryName = "Configurations",
                       CategoryDescription = "Contains Configurations",
                       GroupName = "Application"
                   },
                   new CategoriesEntity()
                   {
                       Id = 4,
                       CategoryName = "Image",
                       CategoryDescription = "All types of images",
                       GroupName = "Media"
                   },
                   new CategoriesEntity()
                   {
                       Id = 5,
                       CategoryName = "Video",
                       CategoryDescription = "All types of videos",
                       GroupName = "Media"
                   },
                   new CategoriesEntity()
                   {
                       Id = 6,
                       CategoryName = "Audio",
                       CategoryDescription = "All types of audios",
                       GroupName = "Media"
                   },
                   new CategoriesEntity()
                   {
                       Id = 7,
                       CategoryName = "Document",
                       CategoryDescription = "All types of documents",
                       GroupName = "Media"
                   }
            );
        }
    }
}
