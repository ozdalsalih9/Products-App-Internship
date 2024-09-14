using System.Text.Json.Serialization;

namespace ProductsAPI.Models
{
    public class Product
    {
        
        public int ProductId { get; set; }
        public string ProductName { get; set; } = null!;
        public int Price { get; set; }
        public bool IsActive { get; set; }
        public int CategoryId { get; set; } 
        public virtual Category? category { get; set; }
        public int CommentId { get; set; }
        public string Details { get; set; } =null!;
        public virtual ICollection<Comment> Comments { get; set; } = new List<Comment>();
    
        
        
    }
}