using System.Text.Json.Serialization;

namespace DemoNextNet.Api.Models;

public class TaskItem
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Notes { get; set; }
    public bool IsComplete { get; set; } = false;

    public int ProjectItemId { get; set; }
    [JsonIgnore]
    public ProjectItem? ProjectItem { get; set; }
}
