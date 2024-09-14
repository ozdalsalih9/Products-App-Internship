using System.Text.Json.Serialization;

namespace ProductsAPI.DTO
{
    public class UserDTO
    {
        
        public string FullName { get; set; } =null!;
        public string Email { get; set; }=null!;
        public string UserName { get; set; }=null!;
        public string Password { get; set; }=null!;
         public int CommentId { get; set; }


    }
}