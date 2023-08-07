using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using Speedy_Fingers.Extensions;

namespace Speedy_Fingers.SignalR
{
    [Authorize]
    public class PresenceHub : Hub
    {
        private readonly PresenceTracker _tracker;
        public PresenceHub(PresenceTracker tracker)
        {
            _tracker = tracker;
        }
        public override async Task OnConnectedAsync()
        {
            var isOnline = await _tracker.UserConnected(Context.User.GetUsername(), Context.ConnectionId);

            if (isOnline)
                await Clients.Others.SendAsync("UserIsOnline", Context.User.GetUsername());


            await Clients.Caller.SendAsync("GetOnlineUsers", await _tracker.GetOnlineUsers());
        }

        public async Task SendInvite(string recipentUsername)
        {
            var connections = await PresenceTracker.GetUserConnections(recipentUsername);
            await Clients.Clients(connections).SendAsync("ReciveInvite", Context.User.GetUsername());
        }

        public async Task InviteAccepted(string senderUsername)
        {
            var connections = await PresenceTracker.GetUserConnections(senderUsername);
            await Clients.Clients(connections).SendAsync("InviteAccepted", Context.User.GetUsername());
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            var isOffline = await _tracker.UserDisconnected(Context.User.GetUsername(), Context.ConnectionId);

            if (isOffline)
                await Clients.Others.SendAsync("UserIsOffline", Context.User.GetUsername());

            await base.OnDisconnectedAsync(exception);
        }
    }
}
