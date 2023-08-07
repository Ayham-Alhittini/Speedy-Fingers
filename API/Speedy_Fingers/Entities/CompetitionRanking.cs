namespace Speedy_Fingers.Entities
{
    public class CompetitionRanking
    {
        public int CompetitionId { get; set; }
        public Competition Competition { get; set; }
        public string UserName { get; set; }
        public int WPM { get; set; }
        public int Keystrokes { get; set; }
    }
}
