using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using DemoNextNet.Api.Data;
using DemoNextNet.Api.Models;

namespace DemoNextNet.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UserSettingsController : ControllerBase
{
    private readonly AppDbContext _context;

    public UserSettingsController(AppDbContext context)
    {
        _context = context;
    }

    // GET: api/usersettings
    [HttpGet]
    public async Task<ActionResult<UserSettings>> GetSettings()
    {
        var settings = await _context.UserSettings.FindAsync(1);
        if (settings == null) return NotFound();
        return Ok(settings);
    }

    // PUT: api/usersettings
    [HttpPatch]
    public async Task<ActionResult<UserSettings>> UpdateSettings(UserSettings settings)
    {
        settings.Id = 1;
        _context.Entry(settings).State = EntityState.Modified;
        await _context.SaveChangesAsync();
        return Ok(settings);
    }
}