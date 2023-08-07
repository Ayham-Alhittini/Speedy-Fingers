using AutoMapper;
using Speedy_Fingers.DTOs;
using Speedy_Fingers.Entities;

namespace Speedy_Fingers.Helper
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
            CreateMap<CompetitionRanking, CompetitionRankingDto>();
            CreateMap<Competition, CompetitionDto>()
                .ForMember(d => d.words, opt => opt.MapFrom(src => src.words.Split().ToList()));

            CreateMap<DateTime, DateTime>().ConvertUsing(d => DateTime.SpecifyKind(d, DateTimeKind.Utc));
            CreateMap<DateTime?, DateTime?>().ConvertUsing(d => d.HasValue ? DateTime.SpecifyKind(d.Value, DateTimeKind.Utc) : null);
        }
    }
}
