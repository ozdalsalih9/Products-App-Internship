namespace ProductsAPI.Models
{
    public class Favorite
    {
        public int FavoriteId { get; set; }
        public int UserId { get; set; }
        public int ProductId { get; set; }
        public virtual AppUser? user { get; set; }
        public virtual Product? product{ get; set; }
    
    
    
    }





}