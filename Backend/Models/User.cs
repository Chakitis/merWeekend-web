using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Backend.Models
{
    public class User
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public required string Id { get; set; }

        [BsonElement("username")]
        public required string Username { get; set; }

        [BsonElement("password")]
        public required string Password { get; set; }
    }

    public class UserLoginModel
{
    public required string Username { get; set; }
    public required string Password { get; set; }
}
}