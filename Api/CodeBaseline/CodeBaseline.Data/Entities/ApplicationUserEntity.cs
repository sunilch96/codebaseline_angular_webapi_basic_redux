using Microsoft.AspNetCore.Identity;

namespace CodeBaseline.Data.Entities
{
    public class ApplicationUserEntity : IdentityUser
    {
        public string? RefreshToken { get; set; }
        public DateTime RefreshTokenExpiryTime { get; set; }
    }
}
