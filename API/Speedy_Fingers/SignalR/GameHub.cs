using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using Speedy_Fingers.Data;
using Speedy_Fingers.Entities;
using Speedy_Fingers.Extensions;
using Speedy_Fingers.Interfaces;

namespace Speedy_Fingers.SignalR
{
    [Authorize]
    public class GameHub: Hub
    {
        private readonly IGameRepository _gameRepository;
        private readonly IGenerateWordRepository _generateWordRepository;
        public GameHub(IGameRepository gameRepository, IGenerateWordRepository generateWordRepository)
        {
            _gameRepository = gameRepository;
            _generateWordRepository = generateWordRepository;
        }

        public override async Task OnConnectedAsync()
        {
            var httpContext = Context.GetHttpContext();
            var otherUser = httpContext.Request.Query["user"];
            var groupName = GetGroupName(Context.User.GetUsername(), otherUser);
            await Groups.AddToGroupAsync(Context.ConnectionId, groupName);
            await AddToGroup(groupName);


        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            await RemoveFromGroup();
            await base.OnDisconnectedAsync(exception);
        }


        public async Task ProgressTrigger(string OtherPlayer)
        {
            var groupName = GetGroupName(Context.User.GetUsername(), OtherPlayer);

            var group = await _gameRepository.GetGroup(groupName);

            var connection = group.Connections.Where(con => con.UserName == OtherPlayer).FirstOrDefault();

            if (connection != null)
            {
                await Clients.Client(connection.ConnectionId).SendAsync("ProgressTrigger");
            }
        }

        public async Task Quit()
        {
            var connection = await _gameRepository.GetConnection(Context.ConnectionId);
            await Clients.Group(connection.GroupName).SendAsync("PlayerQuit", Context.User.GetUsername());
        }

        private async Task<bool> AddToGroup(string groupName)
        {
            var group = await _gameRepository.GetGroup(groupName);
            var connection = new Connection(Context.ConnectionId, Context.User.GetUsername());
            if (group == null)
            {
                group = new Group(groupName);
                _gameRepository.AddGroup(group);
            }

            group.Connections.Add(connection);

            ///check if two users exit
            
            if (group.Connections.Count > 1)
            {
                var words = await _generateWordRepository.WordsGenerator("easy", 50);
                await Clients.Group(groupName).SendAsync("ReciveWords", words);
            }

            return await _gameRepository.SaveChanges();
        }

        private async Task RemoveFromGroup()
        {
            var connection = await _gameRepository.GetConnection(Context.ConnectionId);
            _gameRepository.RemoveConnection(connection);
            await _gameRepository.SaveChanges();
        }

        private string GetGroupName(string user1, string user2)
        {
            var flag = string.CompareOrdinal(user1, user2) < 0;

            return flag ? $"{user1}-{user2}" : $"{user2}-{user1}";
        }

    }
}
