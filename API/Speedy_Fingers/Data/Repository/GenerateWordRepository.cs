using Microsoft.EntityFrameworkCore;
using Speedy_Fingers.Interfaces;

namespace Speedy_Fingers.Data.Repository
{
    public class GenerateWordRepository: IGenerateWordRepository
    {
        private readonly DataContext _context;
        public GenerateWordRepository(DataContext context)
        {
            _context = context;
        }
        public async Task<List<string>> WordsGenerator(string level, int top)
        {
            var words = await _context.Words
                .Where(x => level == "advanced" ? x.word_name.Length >= 5 : x.word_name.Length <= 5)
                .OrderBy(x => Guid.NewGuid()).Select(x => x.word_name).Take(top)
                .ToListAsync();

            return words;
        }

        public async Task<bool> SaveChangesAsync()
        {
            return await _context.SaveChangesAsync() != 0;
        }
    }
}
