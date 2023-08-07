namespace Speedy_Fingers.DTOs
{
    public class CompetitionDto
    {
        public int Id { get; set; }
        public List<string> words { get; set; }
        public DateTime Date { get; set; }
        public List<CompetitionRankingDto> Users { get; set; }
        public long TestsTaken { get; set; }
        public CompetitionTimeDto Time { get; set; }
    }
}
