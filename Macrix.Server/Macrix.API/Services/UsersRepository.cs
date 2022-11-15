using Macrix.API.Entities;
using System.Text.Encodings.Web;
using System.Text.Json;

namespace Macrix.API.Services
{
    public class UsersRepository : IUsersRepository
    {
        private const string DbPath = "users_db.json";
        private List<User> _users;

        public UsersRepository()
        {
            using var streamReader = new StreamReader(DbPath);
            var json = streamReader.ReadToEnd();

            _users = JsonSerializer.Deserialize<List<User>>(json) ?? new List<User>();
        }

        public IEnumerable<User> GetUsers()
            => _users;

        public User? GetUser(Guid userId)
            => _users.FirstOrDefault(u => u.Id == userId);

        public void DeleteUser(User user)
            => _users.Remove(user);

        public void AddUser(User user)
        {
            user.Id = Guid.NewGuid();
            _users.Add(user);
        }

        public void UpdateUser(User user)
        {
            var userToUpdate = _users.FirstOrDefault(u => u.Id == user.Id);
            if (userToUpdate != null) userToUpdate = user;
        }

        public void DiscardChanges()
        {
            using var streamReader = new StreamReader(DbPath);
            var json = streamReader.ReadToEnd();

            _users = JsonSerializer.Deserialize<List<User>>(json) ?? new List<User>();
        }

        public void SaveChanges()
        {
            var jsonString = JsonSerializer.Serialize(_users, new JsonSerializerOptions
            { 
                WriteIndented = true
            });
            File.WriteAllText(DbPath, jsonString);
        }
    }
}
