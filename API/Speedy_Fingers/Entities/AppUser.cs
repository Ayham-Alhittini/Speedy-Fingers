using Microsoft.AspNetCore.Identity;

namespace Speedy_Fingers.Entities
{
    public class AppUser : IdentityUser
    {
        public DateTime MemberSince { get; set; } = DateTime.UtcNow;
        public string KeyboardLayout { get; set; }
        public long TypedWords { get; set; }
        public int TakenTests { get; set; }
        public int CompetitionsTaken{ get; set; }
        public int CompetitionsWon { get; set; }
        public int LowestWPM { get; set; } = -1;
        public int SumWPM { get; set; }
        public int HighestWPM { get; set; }
    }
}
