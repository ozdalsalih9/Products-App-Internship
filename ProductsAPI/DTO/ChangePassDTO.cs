namespace ProductsAPI.DTO
{
    public class ChangePasswordDTO
    {
        public string CurrentPassword { get; set; } = null!;
        public string NewPassword { get; set; } = null!;
        public string Email { get; set; } = null!;
    }
}