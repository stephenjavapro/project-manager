using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using DemoNextNet.Api.Data;
using DemoNextNet.Api.Models;

namespace DemoNextNet.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProjectItemsController : ControllerBase
{
    private readonly AppDbContext _context;

    public ProjectItemsController(AppDbContext context)
    {
        _context = context;
    }

    // GET: api/projectitems
    [HttpGet]
    public async Task<ActionResult<IEnumerable<ProjectItem>>> GetProjects()
    {
        return await _context.Projects
            .Include(p => p.Tasks)
            .ToListAsync();
    }

    // GET: api/projectitems/5
    [HttpGet("{id}")]
    public async Task<ActionResult<ProjectItem>> GetProject(int id)
    {
        var project = await _context.Projects
            .Include(p => p.Tasks)
            .FirstOrDefaultAsync(p => p.Id == id);

        if (project == null) return NotFound();
        return project;
    }

    // POST: api/projectitems
    [HttpPost]
    public async Task<ActionResult<ProjectItem>> CreateProject(ProjectItem project)
    {
        _context.Projects.Add(project);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetProject), new { id = project.Id }, project);
    }

    // PUT: api/projectitems/5
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateProject(int id, ProjectItem project)
    {
        project.Id = id;

        _context.Entry(project).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!_context.Projects.Any(p => p.Id == id)) return NotFound();
            throw;
        }

        return NoContent();
    }

    [HttpPatch("{id}/toggle-status")]
    public async Task<ActionResult<ProjectItem>> ToggleProjectStatus(int id)
    {
        var project = await _context.Projects.FindAsync(id);
        if (project == null) return NotFound();

        project.ClosedAt = project.ClosedAt.HasValue ? null : DateTime.UtcNow;
        await _context.SaveChangesAsync();

        return project;
    }

    // DELETE: api/projectitems/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteProject(int id)
    {
        var project = await _context.Projects.FindAsync(id);
        if (project == null) return NotFound();

        _context.Projects.Remove(project);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}