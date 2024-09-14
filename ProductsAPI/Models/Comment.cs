namespace ProductsAPI.Models{
    public class Comment
    {
        public int CommentId { get; set; }
        public int UserId { get; set; }
        public int ProductId { get; set; }
        public string Content { get; set; } = null!;

        public virtual AppUser? user { get; set; }
       
    }
}