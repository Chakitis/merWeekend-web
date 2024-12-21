using Microsoft.AspNetCore.Mvc;
using Backend.Services;
using System.Threading.Tasks;
using Backend.Models;
using static Backend.Services.ImageService;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/about")]
    public class AboutController : ControllerBase
    {
        private readonly ImageService _imageService;
        private readonly TextService _textService;

        public AboutController(ImageService imageService, TextService textService)
        {
            _imageService = imageService;
            _textService = textService;
        }

        [HttpGet("images")]
        public async Task<IActionResult> GetCarouselImages()
        {
            try 
            {
                var images = await _imageService.GetCarouselImagesAsync();
                if (!images.Any())
                {
                    return Ok(new List<ImageResponse>()); 
                }
                return Ok(images);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet("text")]
        public async Task<IActionResult> GetCarouselText()
        {
            try 
            {
                var text = await _textService.GetCarouselTextAsync();
                if (text == null)
                {
                    return Ok(new { content = "" }); 
                }
                return Ok(new { content = text.Content }); 
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
}