using MongoDB.Driver;
using Backend.Services;
using Backend;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

var jwtSecret = builder.Configuration["JWT:Secret"] ??
    throw new InvalidOperationException("JWT:Secret není nastaven v konfiguraci");

// Add services to the container.
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        builder => builder
            .WithOrigins("http://localhost:3000")
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials());
});

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.ASCII.GetBytes(jwtSecret)),
            ValidateIssuer = false,
            ValidateAudience = false,
            ClockSkew = TimeSpan.Zero
        };
    });

builder.Services.AddControllers();
builder.Services.AddAuthorization();

// Add MongoDB settings
var mongoSettings = builder.Configuration.GetSection(nameof(MongoDBSettings)).Get<MongoDBSettings>();
if (mongoSettings != null)
{
    Console.WriteLine($"ConnectionString: {mongoSettings.ConnectionString}");
    Console.WriteLine($"DatabaseName: {mongoSettings.MerWeekendDB}");
    
    // Register IMongoClient
    builder.Services.AddSingleton<IMongoClient>(sp => 
        new MongoClient(mongoSettings.ConnectionString));
}
else
{
    Console.WriteLine("MongoDB settings are not configured properly.");
}

builder.Services.Configure<MongoDBSettings>(
    builder.Configuration.GetSection(nameof(MongoDBSettings)));
    
builder.Services.AddSingleton<ImageService>();
builder.Services.AddSingleton<TextService>();
builder.Services.AddScoped<AuthService>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
}

app.UseRouting();
app.UseCors("AllowReactApp");
app.UseAuthorization();
app.MapControllers();
app.Run();