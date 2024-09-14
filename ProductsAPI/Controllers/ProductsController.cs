using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProductsAPI.Models;
using ProductsAPI.DTO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.ModelBinding.Binders;
using System.Security.Claims;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace ProductsAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductsController:ControllerBase
    {
        
        private readonly ProductsContext _context;
        public ProductsController(ProductsContext context) 
            {
                _context = context;
            }
            
        [HttpGet]
        public async Task<IActionResult>  GetProducts()
        {
            var products =await _context
                    .Products.Where(i=> i.IsActive).Select(p=> new ProductDTO 
                    {
                        CategoryId = p.CategoryId,
                        ProductId = p.ProductId,
                        ProductName = p.ProductName,
                        Price = p.Price
                    }).ToListAsync();
            return Ok(products);
        }

         [HttpGet("details/{id}")]
         public async Task<IActionResult> GetProductDetails(int id)
        {
            var product = await _context.Products
                .Where(i => i.ProductId == id)
                .Select(p=> new {
                    p.ProductName,
                    p.Price,
                    p.Details
                }).ToListAsync();

                if(product == null)
                {
                    return NotFound();
                }
            
            return Ok(product);



        }

        [HttpGet("categories")]
        public async Task<IActionResult> GetCategories()
        {
            var categories = await _context.Categories
            .Select(c => new CategoryDTO 
            {
                CategoryId = c.CategoryId,
                Name = c.Name
            }).ToListAsync();
            return Ok(categories);
        }

        [HttpGet("CategoryFilter")]
        public async Task<ActionResult<IEnumerable<ProductDTO>>> Filter([FromQuery] int catId)
        {
            if (catId <= 0)
            {
                return BadRequest("Valid category ID is required.");
            }

            var products = await _context.Products
                                        .Where(p => p.CategoryId == catId && p.IsActive)
                                        .Select(p => new ProductDTO 
                                        {
                                            CategoryId = p.CategoryId,
                                            ProductId = p.ProductId,
                                            ProductName = p.ProductName,
                                            Price = p.Price
                                        })
                                        .ToListAsync();

            if (!products.Any())
            {
                return NotFound("No products found for the specified category.");
            }

            return Ok(products);
        }


        
        [HttpGet("{id}")]
        
        public async Task<IActionResult> GetProduct(int? id) 
        {
            if (id==null)
            {
                return NotFound();
            }
            var p = await _context.Products.Select(p=> new ProductDTO 
                    {
                        CategoryId = p.CategoryId,
                        ProductId = p.ProductId,
                        ProductName = p.ProductName,
                        Price = p.Price
                    }).FirstOrDefaultAsync( x => x.ProductId == id);
            if (p==null)
            {
                return NotFound();
            }
            return Ok(p);
        }
        [Authorize(Roles ="Admin")]
        [HttpPost]

        public async Task<IActionResult> CreateProduct(Product entity)
        {
            
            var category = await _context.Categories.FindAsync(entity.CategoryId);
            if (category == null)
            {
                return NotFound("Category not found");
            }

            
            if (string.IsNullOrEmpty(entity.Details))
            {
                entity.Details = "No details provided"; // Varsayılan bir değer
            }

            _context.Products.Add(entity);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetProduct), new { id = entity.ProductId }, entity);
        }




        [Authorize]
        [HttpDelete("favorites/{productId}")]
        public async Task<IActionResult> RemoveFavorite(int productId)
        {
            var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
            int userId = int.Parse(userIdString);

            var favorite = await _context.Favorites
                .FirstOrDefaultAsync(f => f.ProductId == productId && f.UserId == userId);

            if (favorite == null)
            {
                return NotFound();
            }

            _context.Favorites.Remove(favorite);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        
        [Authorize]
        [HttpPost("favorites/{productId}")]
        public async Task<IActionResult> Favorites(int productId)
        {
            var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
            int userId = int.Parse(userIdString);

            var favorite = new Favorite{UserId = userId, ProductId = productId};

            _context.Favorites.Add(favorite);
            await _context.SaveChangesAsync();
            return Ok();

        }

        [HttpGet("favorites")]
        [Authorize]
        public async Task<IActionResult> GetFavorites()
        {
            var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
            int userId = int.Parse(userIdString);
            var favorites = await _context.Favorites
                                        .Where(f => f.UserId == userId)
                                        .Include(f => f.product)
                                        .ToListAsync();
            
            return Ok(favorites.Select(f => f.product));
        }


        
        
        [Authorize(Roles ="Admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProduct(int id, ProductUpdateDto entity)
        {
            if (id!=entity.ProductId)
            {
                return BadRequest();
            }
            var product = await _context.Products.FirstOrDefaultAsync(i => i.ProductId == id);
        
            if (product==null)
            {
                return NotFound();
            }
            product.ProductName = entity.productName;
            product.ProductId = entity.ProductId;
            product.Price = entity.Price;
            product.IsActive = entity.IsActive;
            

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (Exception)
            {
                return NotFound();
            }
            return NoContent();
        }
        [Authorize(Roles ="Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProduct(int? id)
        {
            if (id ==null)
            {
                return NotFound();
            }
            var product = await _context.Products.FirstOrDefaultAsync(i=>i.ProductId == id);

            if (product==null)
            {
                return NotFound();

            }

            _context.Products.Remove(product);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch(Exception)
            {
                return NotFound();
            }
            return NoContent();
        }

        [HttpPost("comment")]
        public async Task<IActionResult> AddComment([FromBody] CommentDto commentDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var comment = new Comment
            {
                UserId = commentDto.UserId,
                ProductId = commentDto.ProductId,
                Content = commentDto.Content,
               
            };

            _context.Comments.Add(comment);
            await _context.SaveChangesAsync();

            // Yanıt DTO'sunu oluştur
            var resultDto = new CommentDto
            {
                CommentId = comment.CommentId,
                UserId = comment.UserId,
                ProductId = comment.ProductId,
                Content = comment.Content

            };

            return Ok(resultDto);
        }

        [HttpGet("comment/{productId}")]
        public async Task<IActionResult> GetCommentsByProduct(int productId)
        {
            var comments = await _context.Comments
                .Where(c => c.ProductId == productId)
                .Include(c => c.user)
                .Select(c => new CommentDto
                {
                    CommentId = c.CommentId,
                    UserId = c.UserId,
                    ProductId = c.ProductId,
                    Content = c.Content,
                })
                .ToListAsync();

            if (comments == null || !comments.Any())
            {
                return NotFound("Bu ürüne ait yorum bulunamadı.");
            }

            return Ok(comments);
        }

        [HttpDelete("comment/{id}")]
        public async Task<IActionResult> DeleteComment(int id)
        {
            var comment = await _context.Comments.FindAsync(id);
            if (comment == null)
            {
                return NotFound();
            }

            _context.Comments.Remove(comment);
            await _context.SaveChangesAsync();

            var resultDto = new CommentDto
            {
                CommentId = comment.CommentId,
                UserId = comment.UserId,
                ProductId = comment.ProductId,
                Content = comment.Content
            };

            return Ok(resultDto); 
        }
    }  
}