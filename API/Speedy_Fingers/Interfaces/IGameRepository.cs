using Speedy_Fingers.Entities;

namespace Speedy_Fingers.Interfaces
{
    public interface IGameRepository
    {
        void AddGroup(Group group);
        void RemoveGroup(Group group);
        void RemoveConnection(Connection connection);
        Task<Connection> GetConnection(string connectionId);
        Task<Connection> GetConnectionByName(string UserName);
        Task<Group> GetGroup(string groupName);
        Task<bool> SaveChanges();
    }
}
