using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace User.Management.API.Migrations
{
    /// <inheritdoc />
    public partial class extendUser : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "KnownAs",
                table: "AspNetUsers",
                newName: "KeyboardLayout");

            migrationBuilder.AddColumn<int>(
                name: "CompetitionsTaken",
                table: "AspNetUsers",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "CompetitionsWon",
                table: "AspNetUsers",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "MemberSince",
                table: "AspNetUsers",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<int>(
                name: "TakenTests",
                table: "AspNetUsers",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<long>(
                name: "TypedWords",
                table: "AspNetUsers",
                type: "bigint",
                nullable: false,
                defaultValue: 0L);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CompetitionsTaken",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "CompetitionsWon",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "MemberSince",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "TakenTests",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "TypedWords",
                table: "AspNetUsers");

            migrationBuilder.RenameColumn(
                name: "KeyboardLayout",
                table: "AspNetUsers",
                newName: "KnownAs");
        }
    }
}
