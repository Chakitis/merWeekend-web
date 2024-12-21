using Backend.Models;
using Backend.Services;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EventLocationController : ControllerBase
    {
        private readonly TextService _textService;

        public EventLocationController(TextService textService)
        {
            _textService = textService;
        }

        [HttpGet("text")]
        public async Task<IActionResult> GetEventLocationText()
        {
            try
            {
                var text = await _textService.GetEventLocationTextAsync();
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