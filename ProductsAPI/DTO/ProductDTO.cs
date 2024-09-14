

namespace ProductsAPI.DTO
{
    public class ProductDTO
    {
        public int ProductId { get; set; }
        public string ProductName { get; set; } = null!;
        public int Price { get; set; }
        public bool isActive { get; set; }
        public int CategoryId { get; set; }
        public string Details { get; set; } = null!;
        public string content { get; set; }=null!;
        
        

        
    }
}