using Speedy_Fingers.Entities;
using Microsoft.EntityFrameworkCore.Migrations;
using System.Text.Json;
#nullable disable

namespace User.Management.API.Migrations
{
    /// <inheritdoc />
    public partial class WordsSeed : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            var wordsData = File.ReadAllText("Data/WordsSeed.json");
            var words = JsonSerializer.Deserialize<List<Word>>(wordsData);
            foreach (var word in words)
            {
                migrationBuilder.Sql($"Insert into words values('{word.word_name}')");
            }
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {

        }
    }
}
