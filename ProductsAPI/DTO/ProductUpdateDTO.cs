namespace ProductsAPI.DTO{
    public class ProductUpdateDto
{
    public int ProductId { get; set; }
    public string productName { get; set; }=null!;
    public int Price { get; set; }
    public bool IsActive { get; set; }
    public int CategoryId { get; set; }
}

}
