using MongoDB.Driver;
using Microsoft.Extensions.Options;
using Backend.Models;
using System.Threading.Tasks;

namespace Backend.Services
{
    public class TextService
    {
        private readonly IMongoCollection<CarouselText> _carouselTexts;
        private readonly IMongoCollection<EventLocationText> _eventLocationTexts;
        private readonly IMongoCollection<EventRulesText> _eventRulesTexts;

        public TextService(IOptions<MongoDBSettings> settings)
        {
            var client = new MongoClient(settings.Value.ConnectionString);
            var database = client.GetDatabase(settings.Value.MerWeekendDB);
            
            _carouselTexts = database.GetCollection<CarouselText>("CarouselText");
            _eventLocationTexts = database.GetCollection<EventLocationText>("EventLocationText");
            _eventRulesTexts = database.GetCollection<EventRulesText>("EventRulesText");
        }

        public async Task<CarouselText> GetCarouselTextAsync()
        {
            return await _carouselTexts.Find(_ => true).FirstOrDefaultAsync();
        }

        public async Task<EventLocationText> GetEventLocationTextAsync()
        {
            return await _eventLocationTexts.Find(_ => true).FirstOrDefaultAsync();
        }

        public async Task<EventRulesText> GetEventRulesTextAsync()
        {
            return await _eventRulesTexts.Find(_ => true).FirstOrDefaultAsync();
        }
    }
}