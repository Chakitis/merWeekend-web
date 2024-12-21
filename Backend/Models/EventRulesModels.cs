using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Backend.Models
{
    public class EventRulesText
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; } = ObjectId.GenerateNewId().ToString();

        [BsonElement("content")]
        public string Content { get; set; } = "";

        [BsonExtraElements]
        public BsonDocument ExtraElements { get; set; } = new BsonDocument();
    }
    public class EventRulesImages
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public required string Id { get; set; }

        [BsonElement("image")]
        public required byte[] Image { get; set; }

        [BsonElement("contentType")]
        public required string ContentType { get; set; }

        [BsonExtraElements]
        public required BsonDocument ExtraElements { get; set; }
    }
}
