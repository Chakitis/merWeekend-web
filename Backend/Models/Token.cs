using System;
using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class Token
    {
        [Key]
        public int Id { get; set; }
        
        [Required]
        public required string TokenString { get; set; }
        
        [Required]
        public required string UserId { get; set; }
        
        [Required]
        public DateTime CreatedAt { get; set; }
        
        [Required]
        public DateTime ExpiresAt { get; set; }
    }
}