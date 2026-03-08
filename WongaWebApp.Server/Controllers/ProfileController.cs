using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using Wonga.Server.Data;

namespace WongaWebApp.Server.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class ProfileController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IWebHostEnvironment _env;

        public ProfileController(ApplicationDbContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }

        [HttpPost("picture")]
        public async Task<IActionResult> UploadPicture(IFormFile file)
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            var user = await _context.Users.FindAsync(userId);

            if (user == null)
                return NotFound();

            if (file == null || file.Length == 0)
                return BadRequest("No file uploaded");

            if (file.Length > 5 * 1024 * 1024)
                return BadRequest("File too large. Max 5MB");

            var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
            var allowed = new[] { ".jpg", ".jpeg", ".png", ".gif" };

            if (!allowed.Contains(extension))
                return BadRequest("Invalid file type. Use jpg, png, or gif");

            var uploadsFolder = Path.Combine(_env.WebRootPath ?? "wwwroot", "uploads");
            if (!Directory.Exists(uploadsFolder))
                Directory.CreateDirectory(uploadsFolder);

            var fileName = $"{userId}_{DateTime.Now.Ticks}{extension}";
            var filePath = Path.Combine(uploadsFolder, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            if (!string.IsNullOrEmpty(user.ProfilePictureUrl))
            {
                var oldFile = Path.Combine(uploadsFolder, Path.GetFileName(user.ProfilePictureUrl));
                if (System.IO.File.Exists(oldFile))
                    System.IO.File.Delete(oldFile);
            }

            user.ProfilePictureUrl = $"/uploads/{fileName}";
            await _context.SaveChangesAsync();

            return Ok(new { url = user.ProfilePictureUrl });
        }

        [HttpDelete("picture")]
        public async Task<IActionResult> RemovePicture()
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");
            var user = await _context.Users.FindAsync(userId);

            if (user == null)
                return NotFound();

            if (!string.IsNullOrEmpty(user.ProfilePictureUrl))
            {
                var filePath = Path.Combine(_env.WebRootPath ?? "wwwroot",
                    user.ProfilePictureUrl.TrimStart('/'));

                if (System.IO.File.Exists(filePath))
                    System.IO.File.Delete(filePath);

                user.ProfilePictureUrl = null;
                await _context.SaveChangesAsync();
            }

            return Ok();
        }
    }
}