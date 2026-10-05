using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using DemoNextNet.Api.Data;
using DemoNextNet.Api.Models;

namespace DemoNextNet.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TaskItemsController : ControllerBase
{
    private readonly AppDbContext _context;

    public TaskItemsController(AppDbContext context)
    {
        _context = context;
    }

    // GET: api/taskitems?projectId=1  (optional filter by project)
    [HttpGet]
    public async Task<ActionResult<IEnumerable<TaskItem>>> GetTasks([FromQuery] int? projectId)
    {
        var query = _context.Tasks.AsQueryable();

        if (projectId.HasValue)
            query = query.Where(t => t.ProjectItemId == projectId.Value);

        return await query.ToListAsync();
    }

    // GET: api/taskitems/5
    [HttpGet("{id}")]
    public async Task<ActionResult<TaskItem>> GetTask(int id)
    {
        var task = await _context.Tasks.FindAsync(id);
        if (task == null) return NotFound();
        return task;
    }

    // POST: api/taskitems
    [HttpPost]
    public async Task<ActionResult<TaskItem>> CreateTask(TaskItem task)
    {
        var projectExists = await _context.Projects.AnyAsync(p => p.Id == task.ProjectItemId);
        if (!projectExists) return BadRequest("Referenced project does not exist.");

        _context.Tasks.Add(task);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetTask), new { id = task.Id }, task);
    }

    // PUT: api/taskitems/5
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateTask(int id, TaskItem task)
    {
        task.Id = id;

        _context.Entry(task).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!_context.Tasks.Any(t => t.Id == id)) return NotFound();
            throw;
        }

        return NoContent();
    }

    // PATCH: api/taskitems/5/toggle  (convenience endpoint for toggling completion)
    [HttpPatch("{id}/toggle")]
    public async Task<IActionResult> ToggleComplete(int id)
    {
        var task = await _context.Tasks.FindAsync(id);
        if (task == null) return NotFound();

        task.IsComplete = !task.IsComplete;
        await _context.SaveChangesAsync();

        return Ok(task);
    }

    // DELETE: api/taskitems/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteTask(int id)
    {
        var task = await _context.Tasks.FindAsync(id);
        if (task == null) return NotFound();

        _context.Tasks.Remove(task);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
