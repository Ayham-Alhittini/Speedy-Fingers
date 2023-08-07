namespace Speedy_Fingers.DTOs
{
    public class ProfileDto
    {
        public string Id { get; set; }
        public string UserName { get; set; }
        public DateTime MemberSince { get; set; }
        public string KeyboardLayout { get; set; }
        public long TypedWords { get; set; }
        public int TakenTests { get; set; }
        public int CompetitionsTaken { get; set; }
        public int CompetitionsWon { get; set; }
        public int LowestWPM { get; set; }
        public int SumWPM { get; set; }
        public int HighestWPM { get; set; }
    }
}
