
using CodeBaseline.Data.Entities;

namespace CodeBaseline.Model.Models
{
    public class CategoriesModel
    {
        public CategoriesModel()
        {

        }
        public CategoriesModel(CategoriesEntity categoriesEntity)
        {
            this.Id= categoriesEntity.Id;
            this.CategoryName = categoriesEntity.CategoryName;
            this.CategoryDescription = categoriesEntity.CategoryDescription;
        }
        public int Id { get; set; }
        public string CategoryName { get; set; }
        public string? CategoryDescription { get; set; }

        //categories: CourseMenu, HomeMenu, Configurations, 
    }
}
