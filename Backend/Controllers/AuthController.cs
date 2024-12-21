using Backend.Models;
using Backend.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly TokenService _tokenService;
        private readonly UserManager<IdentityUser> _userManager;

        public AuthController(TokenService tokenService, UserManager<IdentityUser> userManager)
        {
            _tokenService = tokenService ?? throw new ArgumentNullException(nameof(tokenService));
            _userManager = userManager ?? throw new ArgumentNullException(nameof(userManager));
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
        {
            if (loginDto == null || string.IsNullOrWhiteSpace(loginDto.Username) || string.IsNullOrWhiteSpace(loginDto.Password))
            {
                return BadRequest("Uživatelské jméno a heslo jsou povinné");
            }

            var user = await _userManager.FindByNameAsync(loginDto.Username);
            if (user == null) return Unauthorized(new { message = "Neplatné přihlašovací údaje" });

            var isPasswordValid = await _userManager.CheckPasswordAsync(user, loginDto.Password);
            if (!isPasswordValid) return Unauthorized(new { message = "Neplatné přihlašovací údaje" });

            var token = await _tokenService.GenerateTokenAsync(user.UserName);
            
            return Ok(new { Token = token });
        }

        [HttpPost("generate-token")]
        public async Task<IActionResult> GenerateToken([FromBody] UserLoginModel loginModel)
        {
            var user = await _userManager.FindByNameAsync(loginModel.Username);

            if (user == null)
            {
                return NotFound("User not found.");
            }

            if (string.IsNullOrEmpty(user.UserName))
            {
                return BadRequest("Username is null or empty.");
            }

            var token = await _tokenService.GenerateTokenAsync(user.UserName);

            return Ok(new { Token = token });
        }

        [HttpPost("verify")]
        public async Task<IActionResult> VerifyToken()
        {
            var token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
            if (string.IsNullOrEmpty(token)) return Unauthorized(new { valid = false });

            var isValid = await _tokenService.ValidateTokenAsync(token);
            return Ok(new { valid = isValid });
        }
    }
}