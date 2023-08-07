namespace Speedy_Fingers.DTOs
{
    public class SaveScore
    {
        public int CompetitionId { get; set; }

        private int _wpm;

        public int WPM
        {
            get { return _wpm; }
            set 
            { 
                if (value < 0)
                {
                    throw new ArgumentException("Wpm can't be less than zero");
                }
                _wpm = value;
            }
        }

        private int _keystrokes;

        public int Keystrokes
        {
            get { return _keystrokes; }
            set 
            {
                if (value < 0)
                {
                    throw new ArgumentException("Keystrokes can't be less than zero");
                }
                _keystrokes = value;
            }
        }
    }
}
