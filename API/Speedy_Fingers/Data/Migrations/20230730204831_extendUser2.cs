using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace User.Management.API.Migrations
{
    /// <inheritdoc />
    public partial class extendUser2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "AverageWPM",
                table: "AspNetUsers",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "HighestWPM",
                table: "AspNetUsers",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "LowestWPM",
                table: "AspNetUsers",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AverageWPM",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "HighestWPM",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "LowestWPM",
                table: "AspNetUsers");
        }
    }
}
