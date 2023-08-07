namespace Speedy_Fingers.Entities
{
    public class Competition
    {
        public int Id { get; set; }
        public string words { get; set; }
        public DateTime Date { get; set; } = DateTime.UtcNow;
        public long TestsTaken { get; set; }
        public List<CompetitionRanking> Users { get; set; } = new();
    }
}
