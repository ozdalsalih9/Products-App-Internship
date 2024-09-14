using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using ProductsAPI.Models;
using ProductsAPI.DTO;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;

namespace ProductsAPI.Controllers

{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController:ControllerBase
    {
        
        private readonly UserManager<AppUser> _userManager;
        private readonly SignInManager<AppUser> _signInManager;
        private readonly IConfiguration _configuration;


        public UsersController(UserManager<AppUser> userManager, SignInManager<AppUser> signInManager, IConfiguration configuration)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _configuration = configuration;
            
            
        }

        [HttpGet]
        public async Task<IActionResult> GetUsers()
        {
            // Tüm kullanıcıları al
            var users = await _userManager.Users.ToListAsync();

            if (users == null || !users.Any())
            {
                return NotFound("Kullanıcı bulunamadı.");
            }

            
            // Kullanıcıları döndür
            return Ok(users);
        }



        [HttpPost("register")]
        public async Task<ActionResult> CreateUser(UserDTO model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
                var user = new AppUser
            {
                UserName = model.UserName,
                Email = model.Email,
                FullName = model.FullName,
                DateAdded = DateTime.Now
            };

            var result = await _userManager.CreateAsync(user, model.Password);

            if (result.Succeeded)
            {
                  return Ok();
            }
            return BadRequest(result.Errors);
            
        }
        [HttpPost("login")]
        public async Task<ActionResult> Login(LoginDTO model)
        {
            
            var user = await _userManager.FindByEmailAsync(model.Email);
            

            if(user ==null)
            {
                return BadRequest(new { message = "Email Hatalı" });
            }
            var result = await _signInManager.CheckPasswordSignInAsync(user, model.Password, false);

            if (result.Succeeded)
            {

                return Ok(new {token = GenerateJWT(user)});
            }
            return Unauthorized();
        }
        
        [HttpPut("changepassword")]
        public async Task<ActionResult> ChangePass (ChangePasswordDTO model)
        {
            var user =await _userManager.FindByEmailAsync(model.Email);

            if (user == null)
            {
                return BadRequest();
            }
            var result = await _userManager.ChangePasswordAsync(user, model.CurrentPassword, model.NewPassword);
            if (result.Succeeded)
            {
                return Ok();
                

            }

            return BadRequest();
        }

       private string GenerateJWT(AppUser user)
    {
    var tokenHandler = new JwtSecurityTokenHandler();
    var key = Encoding.ASCII.GetBytes(_configuration.GetSection("AppSettings:Secret").Value ?? "");

    var userRoles = _userManager.GetRolesAsync(user).Result; 
    var claims = new List<Claim>
    {
        new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
        new Claim(ClaimTypes.Name, user.UserName ?? "")
    };

    foreach (var role in userRoles)
    {
        claims.Add(new Claim(ClaimTypes.Role, role));
    }

    var tokenDescriptor = new SecurityTokenDescriptor
    {
        Subject = new ClaimsIdentity(claims),
        Expires = DateTime.UtcNow.AddHours(2), 
        SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
    };

    var token = tokenHandler.CreateToken(tokenDescriptor);
    return tokenHandler.WriteToken(token);
    }

    }
}