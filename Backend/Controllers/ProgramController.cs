using Microsoft.AspNetCore.Mvc;
using Backend.Services;
using System.Threading.Tasks;
using System.Collections.Generic;
using System;
using static Backend.Services.ImageService;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/program")]
    public class ProgramController(ImageService imageService) : ControllerBase
    {
        private readonly ImageService _imageService = imageService;

        [HttpGet("images")]
        public async Task<IActionResult> GetProgramImages()
        {
            try 
            {
                var images = await _imageService.GetProgramImagesAsync();
                if (!images.Any())
                {
                    return Ok(new List<ImageResponse>()); 
                }
                return Ok(images);
            }
            catch (Exception ex)
            {
                // Log the exception
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
}