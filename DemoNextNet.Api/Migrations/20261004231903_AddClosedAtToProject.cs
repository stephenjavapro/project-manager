using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DemoNextNet.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddClosedAtToProject : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "ClosedAt",
                table: "Projects",
                type: "datetime2",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ClosedAt",
                table: "Projects");
        }
    }
}
