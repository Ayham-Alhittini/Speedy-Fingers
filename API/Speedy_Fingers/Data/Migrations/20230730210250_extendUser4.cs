using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace User.Management.API.Migrations
{
    /// <inheritdoc />
    public partial class extendUser4 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AverageWPM",
                table: "AspNetUsers");

            migrationBuilder.AddColumn<int>(
                name: "SumWPM",
                table: "AspNetUsers",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "SumWPM",
                table: "AspNetUsers");

            migrationBuilder.AddColumn<double>(
                name: "AverageWPM",
                table: "AspNetUsers",
                type: "float",
                nullable: false,
                defaultValue: 0.0);
        }
    }
}
