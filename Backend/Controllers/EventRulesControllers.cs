using Backend.Models;
using Backend.Services;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EventRulesController : ControllerBase
    {
        private readonly TextService _textService;
        private readonly ImageService _imageService;

        public EventRulesController(TextService textService, ImageService imageService)
        {
            _textService = textService;
            _imageService = imageService;
        }

        [HttpGet("text")]
        public async Task<IActionResult> GetEventRulesText()
        {
            try
            {
                var text = await _textService.GetEventRulesTextAsync();
                if (text == null)
                {
                    return Ok(new { content = "" });
                }
                return Ok(new { content = text.Content });
            }
            catch (Exception ex)
            {
                // Log the exception
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet("images")]
        public async Task<IActionResult> GetEventRulesImages()
        {
            try
            {
                var images = await _imageService.GetEventRulesImagesAsync();
                if (!images.Any())
                {
                    return Ok(new List<ImageService.ImageResponse>());
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