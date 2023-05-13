using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CodeBaseline.Data.Entities
{
    public class MediaEntity
    {
        [Key]
        [DatabaseGenerated( DatabaseGeneratedOption.Identity )]
        public int MediaId{ get; set; }
        public int? SubCourseId { get; set; }
        public string Path { get; set; }
        public string Name { get; set; }
        public string? Description { get; set; }
        public string? Url { get; set; }
        public bool? Enabled { get; set; }        
        public DateTime? Created { get; set; }
        public DateTime? Updated { get; set; }
        public virtual CategoriesEntity? Category { get; set; }
    }
}
