using CodeBaseline.Data.Entities;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CodeBaseline.Model.Models
{
    public class CourseTilesModel
    {
        public CourseTilesModel()
        {

        }
        public CourseTilesModel(CourseTilesEntity courseTilesEntity)
        {
            this.CourseId = courseTilesEntity.CourseId;
            this.SubCourseId = courseTilesEntity.SubCourseId;
            this.Name = courseTilesEntity.Name;
            this.Description = courseTilesEntity.Description;
            this.SequenceNumber = courseTilesEntity.SequenceNumber;
            this.SortByDescending = courseTilesEntity.SortByDescending;
            this.Url = courseTilesEntity.Url;
            this.Enabled = courseTilesEntity.Enabled;
            this.Created = courseTilesEntity.Created;
            this.Updated = courseTilesEntity.Updated;
        }

        public int CourseId{ get; set; }
        public int? SubCourseId { get; set; }
        public string? Name { get; set; }
        public string? Description { get; set; }
        public int? SequenceNumber { get; set; }
        public bool? SortByDescending { get; set; }
        public string? Url { get; set; }
        public bool? Enabled { get; set; }
        public DateTime? Created { get; set; }
        public DateTime? Updated { get; set; }
        public int MenuId { get; set; }
        public bool? IsContentAvailable { get; set; }
        public List<CourseTilesModel>? ChildSubCourses { get; set; }
        public List<MediaModel>? Medias { get; set; }
    }
}
