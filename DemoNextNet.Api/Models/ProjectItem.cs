namespace DemoNextNet.Api.Models;

public class ProjectItem
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }

    public Priority Priority { get; set; } = Priority.Medium;
    public DateTime? DueDate { get; set; }

    public DateTime? ClosedAt { get; set; }
    public List<TaskItem> Tasks { get; set; } = new();
}
