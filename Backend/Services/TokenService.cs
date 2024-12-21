using Backend.Models;
using Microsoft.Extensions.Configuration;
using MongoDB.Driver;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Extensions.Options;

namespace Backend.Services
{
    public class TokenService
{
    private readonly string _jwtKey;
    private readonly string _jwtIssuer;
    private readonly string _jwtAudience;
    private readonly IMongoCollection<Token> _tokens;

    public TokenService(IConfiguration configuration, IOptions<MongoDBSettings> settings)
    {
        _jwtKey = configuration["Jwt:Key"] 
            ?? throw new InvalidOperationException("JWT Key is not configured");
        _jwtIssuer = configuration["Jwt:Issuer"] 
            ?? throw new InvalidOperationException("JWT Issuer is not configured");
        _jwtAudience = configuration["Jwt:Audience"] 
            ?? throw new InvalidOperationException("JWT Audience is not configured");

        var client = new MongoClient(settings.Value.ConnectionString);
        var database = client.GetDatabase(settings.Value.MerWeekendDB);
        _tokens = database.GetCollection<Token>("Tokens");
    }

    public async Task<string> GenerateTokenAsync(string username)
    {
        if (string.IsNullOrEmpty(username))
            throw new ArgumentNullException(nameof(username));

        var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtKey));
        var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(ClaimTypes.Name, username),
            new Claim(ClaimTypes.Role, "User")
        };

        var token = new JwtSecurityToken(
            issuer: _jwtIssuer,
            audience: _jwtAudience,
            claims: claims,
            expires: DateTime.Now.AddHours(24),
            signingCredentials: credentials
        );

        var tokenString = new JwtSecurityTokenHandler().WriteToken(token);

        var tokenEntity = new Token
        {
            TokenString = tokenString,
            UserId = username,
            CreatedAt = DateTime.Now,
            ExpiresAt = DateTime.Now.AddHours(24)
        };

        try
        {
            await _tokens.InsertOneAsync(tokenEntity);
        }
        catch (Exception ex)
        {
            throw new InvalidOperationException("Failed to save token to the database", ex);
        }

        return tokenString;
    }

    public async Task<bool> ValidateTokenAsync(string token)
    {
        try
        {
            var storedToken = await _tokens.Find(t => t.TokenString == token).FirstOrDefaultAsync();

            if (storedToken == null) return false;

            if (storedToken.ExpiresAt < DateTime.Now)
            {
                await _tokens.DeleteOneAsync(t => t.TokenString == token);
                return false;
            }

            return true;
        }
        catch (Exception ex)
        {
            throw new InvalidOperationException("Failed to validate token", ex);
        }
    }
}

}