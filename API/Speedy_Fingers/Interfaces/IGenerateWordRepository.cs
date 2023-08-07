namespace Speedy_Fingers.Interfaces
{
    public interface IGenerateWordRepository
    {
        public Task<List<string>> WordsGenerator(string level, int top);
        public Task<bool> SaveChangesAsync();
    }
}
