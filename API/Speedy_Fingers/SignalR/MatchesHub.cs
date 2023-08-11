using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Speedy_Fingers.Data;
using Speedy_Fingers.Extensions;

namespace Speedy_Fingers.SignalR
{
    [Authorize]
    public class MatchesHub: Hub
    {
        private readonly DataContext _context;
        public MatchesHub(DataContext context)
        {
            _context = context;
        }
        public override async Task OnConnectedAsync()
        {
            if (await _context.Matches.AnyAsync())
            {
                var firstInTime = _context.Matches.Min(m => m.EnrollTime);
                var firstInUser = _context.Matches
                    .FirstOrDefault(m => m.EnrollTime == firstInTime);

                _context.Remove(firstInUser);
                _context.SaveChanges();

                await Clients.Client(firstInUser.ConnectionId).SendAsync("FindMatch", Context.User.GetUsername());
                await Clients.Caller.SendAsync("FindMatch", firstInUser.UserName);
            }
            else
            {
                _context.Matches.Add(new Entities.Matche
                {
                    UserName = Context.User.GetUsername(),
                    ConnectionId = Context.ConnectionId,
                });
                _context.SaveChanges();
            }
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            var matche = await _context.Matches.FirstOrDefaultAsync(m => m.UserName == Context.User.GetUsername());
            if (matche != null)
            {
                _context.Matches.Remove(matche); 
                _context.SaveChanges();
            }
            await base.OnDisconnectedAsync(exception);
        }
    }
}
