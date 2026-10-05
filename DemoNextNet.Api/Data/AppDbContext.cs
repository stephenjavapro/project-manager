using Microsoft.EntityFrameworkCore;
using DemoNextNet.Api.Models;

namespace DemoNextNet.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<ProjectItem> Projects { get; set; }
    public DbSet<TaskItem> Tasks { get; set; }
    public DbSet<UserSettings> UserSettings { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<UserSettings>().HasData(
            new UserSettings { Id = 1, DueDateWarningDays = 7 }
        );
    }
}
