using MongoDB.Driver;
using Microsoft.Extensions.Options;
using Microsoft.Extensions.Configuration;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Backend.Models;
using BCrypt.Net;

namespace Backend.Services
{
    public class AuthService
    {
        private readonly IMongoCollection<User> _users;
        private readonly IMongoCollection<Token> _tokens;
        private readonly IConfiguration _configuration;

        public AuthService(IOptions<MongoDBSettings> settings, IConfiguration configuration)
        {
            var client = new MongoClient(settings.Value.ConnectionString);
            var database = client.GetDatabase(settings.Value.MerWeekendDB);
            
            _users = database.GetCollection<User>("Users");
            _tokens = database.GetCollection<Token>("Tokens");
            _configuration = configuration;
        }

        public async Task<(string? token, string? error)> LoginAsync(string username, string password)
        {
            var user = await _users.Find(x => x.Username == username).FirstOrDefaultAsync();
            
            if (user == null)
            {
                return (null, "Uživatel nenalezen.");
            }

            if (!VerifyPassword(password, user.Password))
            {
                return (null, "Nesprávné heslo.");
            }

            var token = GenerateJwtToken(user.Id);
            
            await _tokens.InsertOneAsync(new Token
            {
                TokenString = token,
                UserId = user.Id
            });

            return (token, null);
        }

    private string GenerateJwtToken(string userId)
    {
        var tokenHandler = new JwtSecurityTokenHandler();
        var jwtSecret = _configuration["JWT:Secret"] ?? 
            throw new InvalidOperationException("JWT:Secret není nastaven v konfiguraci");
        var key = Encoding.ASCII.GetBytes(jwtSecret);
        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(new[]
            {
                new Claim(ClaimTypes.NameIdentifier, userId)
            }),
            Expires = DateTime.UtcNow.AddHours(1),
            SigningCredentials = new SigningCredentials(
                new SymmetricSecurityKey(key),
                SecurityAlgorithms.HmacSha256Signature)
        };

        var token = tokenHandler.CreateToken(tokenDescriptor);
        return tokenHandler.WriteToken(token);
    }

        private bool VerifyPassword(string password, string hashedPassword)
        {
            return BCrypt.Net.BCrypt.Verify(password, hashedPassword);
        }
    }
}