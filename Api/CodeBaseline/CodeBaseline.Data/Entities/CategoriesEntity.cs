using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Linq;

namespace CodeBaseline.Data.Entities
{
    [Index(nameof(CategoryName), IsUnique = true)]
    public class CategoriesEntity
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        public string CategoryName { get; set; }
        public string? CategoryDescription { get; set; }
        public string? GroupName { get; set; }

        //categories: CourseMenu, HomeMenu, Configurations, 

    }
}
