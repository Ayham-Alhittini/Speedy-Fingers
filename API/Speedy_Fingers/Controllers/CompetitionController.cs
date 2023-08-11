using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Speedy_Fingers.Data;
using Speedy_Fingers.DTOs;
using Speedy_Fingers.Entities;
using Speedy_Fingers.Extensions;
using Speedy_Fingers.Interfaces;

namespace Speedy_Fingers.Controllers
{
    public class CompetitionController: BaseApiController
    {
        private readonly IGenerateWordRepository _wordsGenerator;
        private readonly DataContext _context;
        private readonly IMapper _mapper;

        const int CompetitionStartTime = 9;
        const int CompetitionEndTime = 15;



        public CompetitionController(IGenerateWordRepository generateWordRepository, DataContext context, IMapper mapper)
        {
            _wordsGenerator = generateWordRepository;
            _context = context;
            _mapper = mapper;
        }

        [AllowAnonymous]
        [HttpGet("last-competition-result")]
        public async Task<ActionResult> LastCompetitionResult()
        {
            if (!await _context.Rankings.AnyAsync())
            {
                return Ok(new List<CompetitionRankingDto>());
            }
            int lastCompetitionId = _context.Rankings.Max(x => x.CompetitionId);


            var query = _context.Rankings.Where(r => r.CompetitionId == lastCompetitionId).OrderByDescending(r => r.WPM)
                .AsQueryable();

            var result = await query.ProjectTo<CompetitionRankingDto>(_mapper.ConfigurationProvider)
                .ToListAsync();

            return Ok(result);
        }

        [AllowAnonymous]
        [HttpGet("check-state")]
        public ActionResult CheckState()
        {
            return Ok(new
            {
                contestRunning = getState()
            });
        }

        [AllowAnonymous]
        [HttpGet("get-competition")]
        public async Task<ActionResult> GetCompetition()
        {
            
            var query = _context.Competitions.OrderByDescending(comp => comp.Date);


            var lastCompetition = await query.ProjectTo<CompetitionDto>(_mapper.ConfigurationProvider).FirstOrDefaultAsync();



            if (getState() || lastCompetition == null)///competition time
            {
                ///send time tell finsh

                var time = getTimeTellCompetitionEnd();

                if (lastCompetition != null && lastCompetition.Date.IsToday()) ///stored in database   #IsToady an custome extention in extensions folder#
                {
                    lastCompetition.Users = lastCompetition.Users.OrderByDescending(u => u.WPM).ToList();

                    lastCompetition.Time = new CompetitionTimeDto
                    {
                        Hours = time.Hours,
                        Minutes = time.Minutes,
                        Seconds = time.Seconds,
                    };

                    return Ok(lastCompetition);
                }
                else ///need to create it
                {
                    var competition = new Competition
                    {
                        words = await WordsToString(),
                    };

                    _context.Competitions.Add(competition);
                    await _context.SaveChangesAsync();

                    lastCompetition.Time = new CompetitionTimeDto
                    {
                        Hours = time.Hours,
                        Minutes = time.Minutes,
                        Seconds = time.Seconds,
                    };

                    return Ok(_mapper.Map<CompetitionDto>(competition));
                }
            }
            else
            {
                ///send time tell start
                lastCompetition.Users = lastCompetition.Users.OrderByDescending(u => u.WPM).ToList();

                var time = getTimeTellCompetitionStart();

                lastCompetition.Time = new CompetitionTimeDto
                {
                    Hours = time.Hours,
                    Minutes = time.Minutes,
                    Seconds = time.Seconds,
                };

                return Ok(lastCompetition);
            }
        }

        [Authorize]
        [HttpPost("save-score")]
        public async Task<ActionResult> SaveScore(SaveScore score)//// when user enroll the competition
        {
            ///check that the competition exit
            
            var competition = await _context.Competitions.Include(comp => comp.Users)
                .Where(comp => comp.Id == score.CompetitionId)
                .FirstOrDefaultAsync();

            if (competition == null)
            {
                return NotFound("Competition not exit");
            }
            if (!competition.Date.IsToday())
            {
                return BadRequest("This competition is finshed");
            }
            if (!getState())
            {
                return BadRequest("Not competition time");
            }

            string response = "";
            ////if he already do competition
            var user = competition.Users.Where(u => u.UserName == User.GetUsername()).FirstOrDefault();
            if (user != null)
            {
                user.WPM = Math.Max(user.WPM, score.WPM);
                user.Keystrokes = Math.Max(user.Keystrokes, score.Keystrokes);

                response = "competition result updated";
            }
            else ///first time
            {
                var competitionRank = new CompetitionRanking
                {
                    CompetitionId = score.CompetitionId,
                    UserName = User.GetUsername(),
                    WPM = score.WPM,
                    Keystrokes = score.Keystrokes
                };

                response = "competition result added";
                competition.Users.Add(competitionRank);
            }
            competition.TestsTaken += 1;

            await _context.SaveChangesAsync();

            return Ok(new
            {
                Response = response
            });
        }

        private TimeSpan getTimeTellCompetitionStart()
        {
            DateTime now = DateTime.UtcNow;
            DateTime competitionTime;

            ////if hour less than Competition Start Time it's today
            if (now.Hour < CompetitionStartTime)
            {
                 competitionTime = new DateTime(now.Year, now.Month, now.Day, CompetitionStartTime, 0, 0);
            }
            else ///hour >= Competitoin End Time competition tommorw
            {
                DateTime temp = now.AddDays(1);

                competitionTime = new DateTime(temp.Year, temp.Month, temp.Day, CompetitionStartTime, 0, 0);
            }

            return competitionTime - now;
        }

        private TimeSpan getTimeTellCompetitionEnd()
        {
            DateTime now = DateTime.UtcNow;
            DateTime competitionTime;

            if (now.Hour < CompetitionEndTime)
            {
                competitionTime = new DateTime(now.Year, now.Month, now.Day, CompetitionEndTime, 0, 0);
            }
            else
            {
                DateTime temp = now.AddDays(1);

                competitionTime = new DateTime(temp.Year, temp.Month, temp.Day, CompetitionEndTime, 0, 0);
            }

            return competitionTime - now;
        }


        private bool getState()
        {
            var time = DateTime.UtcNow;
            return time.Hour >= CompetitionStartTime && time.Hour < CompetitionEndTime;
        }

        private async Task<string> WordsToString()
        {
            string wordsDB = "";
            var words_list = await _wordsGenerator.WordsGenerator("easy", 200);
            foreach (var word in words_list)
            {
                wordsDB += word + " ";
            }
            wordsDB = wordsDB.Remove(wordsDB.Length - 1);

            return wordsDB;
        }
    }
}
