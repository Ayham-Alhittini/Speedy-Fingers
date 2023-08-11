using Microsoft.EntityFrameworkCore;
using Speedy_Fingers.Entities;
using Speedy_Fingers.Interfaces;

namespace Speedy_Fingers.Data.Repository
{
    public class GameRepository : IGameRepository
    {
        private readonly DataContext _context;
        public GameRepository(DataContext context)
        {
            _context = context;
        }
        public void AddGroup(Group group)
        {
            _context.Groups.Add(group);
        }

        public async Task<bool> CheckGroupConnections(string groupName)
        {
            return await _context.Connections.CountAsync(con => con.GroupName == groupName) > 1;
        }

        public async Task<Connection> GetConnection(string connectionId)
        {
            return await _context.Connections.Where(con => con.ConnectionId == connectionId)
                .Include(con => con.Group).FirstOrDefaultAsync();
        }

        public async Task<Connection> GetConnectionByName(string UserName)
        {
            return await _context.Connections.Where(con => con.UserName == UserName)
                .FirstOrDefaultAsync();
        }

        public async Task<Group> GetGroup(string groupName)
        {
            return await _context.Groups.Where(g => g.Name == groupName)
                .Include(g => g.Connections).FirstOrDefaultAsync();
        }

        public void RemoveConnection(Connection connection)
        {
            _context.Connections.Remove(connection);
        }

        public void RemoveGroup(Group group)
        {
            _context.Groups.Remove(group);
        }

        public async Task<bool> SaveChanges()
        {
            return await _context.SaveChangesAsync() > 0;
        }
    }
}
