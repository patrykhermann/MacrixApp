using Macrix.API.Entities;

namespace Macrix.API.Services
{
    public interface IUsersRepository
    {
        IEnumerable<User> GetUsers();
        User? GetUser(Guid userId);
        void UpdateUser(User user);
        void AddUser(User user);
        void DeleteUser(User user);
        void SaveChanges();
        void DiscardChanges();
    }
}
