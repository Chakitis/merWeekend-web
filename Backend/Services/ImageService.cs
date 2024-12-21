using MongoDB.Driver;
using Microsoft.Extensions.Options;
using Backend.Models;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace Backend.Services
{
    public class ImageService
    {
        private readonly IMongoCollection<CarouselImage> _carouselImages;
        private readonly IMongoCollection<EventRulesImages> _eventRulesImages;
        private readonly IMongoCollection<ProgramImage> _programImages;
        private readonly IMongoDatabase _database;

        public ImageService(IOptions<MongoDBSettings> settings)
        {
            var client = new MongoClient(settings.Value.ConnectionString);
            _database = client.GetDatabase(settings.Value.MerWeekendDB);
            
            _carouselImages = _database.GetCollection<CarouselImage>("CarouselImages");
            _eventRulesImages = _database.GetCollection<EventRulesImages>("EventRulesImages");
            _programImages = _database.GetCollection<ProgramImage>("ProgramImages");
        }

        public class ImageResponse
        {
            public required string Id { get; set; }
            public required string Url { get; set; }
            public required string ContentType { get; set; }
        }

        public async Task<List<ImageResponse>> GetCarouselImagesAsync()
        {
            var images = await _carouselImages.Find(_ => true).ToListAsync();
            return images.Select(img => new ImageResponse
            {
                Id = img.Id,
                Url = $"data:{img.ContentType};base64,{Convert.ToBase64String(img.Image)}",
                ContentType = img.ContentType
            }).ToList();
        }

        public async Task<List<ImageResponse>> GetProgramImagesAsync()
        {
            var images = await _programImages.Find(_ => true).ToListAsync();
            return images.Select(img => new ImageResponse
            {
                Id = img.Id,
                Url = $"data:{img.ContentType};base64,{Convert.ToBase64String(img.Image)}",
                ContentType = img.ContentType
            }).ToList();
        }

        public async Task<List<ImageResponse>> GetEventRulesImagesAsync()
        {
            var images = await _eventRulesImages.Find(_ => true).ToListAsync();
            return images.Select(img => new ImageResponse
            {
                Id = img.Id,
                Url = $"data:{img.ContentType};base64,{Convert.ToBase64String(img.Image)}",
                ContentType = img.ContentType
            }).ToList();
        }
    }
}