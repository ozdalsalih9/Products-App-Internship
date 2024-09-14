using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Identity;

namespace ProductsAPI.Models

{
    public class AppUser:IdentityUser<int>
    {   
        
        public string? FullName { get; set; }
        public DateTime DateAdded { get; set; }
        public int CommentId { get; set; }
        public virtual ICollection<Comment> Comments { get; set; } = new List<Comment>();
    }
}