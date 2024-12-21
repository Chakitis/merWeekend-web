using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Backend.Models
{
    public class EventLocationText
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; } = ObjectId.GenerateNewId().ToString();

        [BsonElement("content")]
        public string Content { get; set; } = "";

        [BsonExtraElements]
        public BsonDocument ExtraElements { get; set; } = new BsonDocument();
    }
}

