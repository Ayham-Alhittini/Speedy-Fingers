using Speedy_Fingers.Entities;

namespace Speedy_Fingers.Interfaces
{
    public interface ITokenService
    {
        Task<string> CreateToken(AppUser user);
    }
}
