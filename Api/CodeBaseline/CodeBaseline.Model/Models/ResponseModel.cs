using System.Security.Policy;

namespace CodeBaseline.Model.Models
{
    public class ResponseModel
    {
        public string? Status { get; set; }
        public string? Message { get; set; }
        public bool isProcessed { get; set; }
        public List<string>? Messages { get;set; }
    }
}
