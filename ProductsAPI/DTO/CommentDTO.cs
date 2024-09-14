namespace ProductsAPI.Models
{
    public class CommentDto
    {
        public int CommentId { get; set; }
        public int UserId { get; set; }
        public int ProductId { get; set; }
        public string Content { get; set; } = null!;

    }
}