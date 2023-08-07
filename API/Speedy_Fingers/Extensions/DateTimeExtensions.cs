namespace Speedy_Fingers.Extensions
{
    public static class DateTimeExtensions
    {
        public static int CalculateAge(this DateOnly dob)
        {
            var today = DateOnly.FromDateTime(DateTime.UtcNow);
            var age = today.Year - dob.Year;

            if (dob > today.AddYears(-age)) --age;
            return age;
        }

        public static bool IsToday(this DateTime d1)
        {
            var d2 = DateTime.UtcNow;
            return d1.Year == d2.Year && d1.Month == d2.Month && d1.Day == d2.Day;
        }
    }
}
