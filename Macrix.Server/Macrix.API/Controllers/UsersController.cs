using AutoMapper;
using Macrix.API.Entities;
using Macrix.API.Models;
using Macrix.API.Services;
using Microsoft.AspNetCore.Mvc;

namespace Macrix.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly IUsersRepository _usersRepository;
        private readonly IMapper _mapper;

        public UsersController(IUsersRepository usersRepository, IMapper mapper)
        {
            _usersRepository = usersRepository ?? throw new ArgumentNullException(nameof(usersRepository));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserDto>>> GetUsers()
        {
            var users = _usersRepository.GetUsers();

            return Ok(_mapper.Map<IEnumerable<UserDto>>(users));
        }

        [HttpGet("{userId}", Name = "GetUser")]
        public async Task<ActionResult<UserDto>> GetUser(Guid userId)
        {
            var user = _usersRepository.GetUser(userId);

            if (user == null)
            {
                return NotFound();
            }

            return Ok(_mapper.Map<UserDto>(user));
        }

        [HttpPost]
        public async Task<ActionResult> CreateUser(UserForManipulationDto userForCreationDto)
        {
            var userEntity = _mapper.Map<User>(userForCreationDto);

            _usersRepository.AddUser(userEntity);

            return CreatedAtRoute("GetUser", new { userId = userEntity.Id }, userEntity);
        }

        [HttpPut("{userId}")]
        public async Task<ActionResult> UpdateUser(Guid userId, UserForManipulationDto userForUpdateDto)
        {
            var userFromRepo = _usersRepository.GetUser(userId);

            if (userFromRepo == null)
            {
                return NotFound();
            }

            _mapper.Map(userForUpdateDto, userFromRepo);

            _usersRepository.UpdateUser(userFromRepo);

            return NoContent();
        }

        [HttpDelete("{userId}")]
        public async Task<ActionResult> DeleteUser(Guid userId)
        {
            var userFromRepo = _usersRepository.GetUser(userId);

            if (userFromRepo == null)
            {
                return NotFound();
            }

            _usersRepository.DeleteUser(userFromRepo);

            return NoContent();
        }

        [HttpPost("SaveChanges")]
        public IActionResult SaveChanges()
        {
            try
            {
                _usersRepository.SaveChanges();
                return Ok();
            }
            catch(Exception ex)
            {
                return Problem(ex.Message);
            }
        }

        [HttpPost("DiscardChanges")]
        public IActionResult DiscardChanges()
        {
            try
            {
                _usersRepository.DiscardChanges();
                return Ok();
            }
            catch (Exception ex)
            {
                return Problem(ex.Message);
            }
        }
    }
}
