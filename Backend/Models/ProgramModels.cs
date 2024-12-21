using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Backend.Models
{
     public class ProgramImage
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