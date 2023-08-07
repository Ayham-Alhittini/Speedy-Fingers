using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Speedy_Fingers.Data;
using Speedy_Fingers.DTOs;
using Speedy_Fingers.Entities;
using Speedy_Fingers.Extensions;
using Speedy_Fingers.Interfaces;

namespace Speedy_Fingers.Controllers
{
    public class WordsGenerator : BaseApiController
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly IGenerateWordRepository _wordsRepository;
        public WordsGenerator(UserManager<AppUser> userManager, IGenerateWordRepository generateWordRepository)
        {
            _userManager = userManager;
            _wordsRepository = generateWordRepository;
        }

        [HttpGet("generate-words")]
        public async Task<ActionResult> GenerateWords([FromQuery] string level)
        {
            return Ok(await _wordsRepository.WordsGenerator(level, 200));
        }

        [Authorize]
        [HttpPost("result-synchronization")]
        public async Task<ActionResult> Synchronization(TypingTestResult testResult)
        {
            var user = await _userManager.FindByIdAsync(User.GetUserId());

            user.TypedWords += testResult.WordsCount;
            user.TakenTests += 1;

            if (user.LowestWPM == -1)
                user.LowestWPM = testResult.WPM;
            else
                user.LowestWPM = Math.Min(user.LowestWPM, testResult.WPM);

            user.HighestWPM = Math.Max(user.HighestWPM, testResult.WPM);
            user.SumWPM += testResult.WPM;

            await _wordsRepository.SaveChangesAsync();
            return Ok();
        }
    }
}
