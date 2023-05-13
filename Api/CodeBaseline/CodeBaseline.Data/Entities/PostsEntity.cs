using System.ComponentModel.DataAnnotations.Schema;

namespace CodeBaseline.Data.Entities
{
    public class PostsEntity
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }

    }
}