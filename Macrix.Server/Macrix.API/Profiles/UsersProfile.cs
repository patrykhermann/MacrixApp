using AutoMapper;
using Macrix.API.Extensions;

namespace Macrix.API.Profiles
{
    public class UsersProfile : Profile
    {
        public UsersProfile()
        {
            CreateMap<Entities.User, Models.UserDto>()
                .ForMember(
                dest => dest.Age,
                opt => opt.MapFrom(src => src.DateOfBirth.GetCurrentAge()));
            CreateMap<Models.UserForManipulationDto, Entities.User>();
        }
    }
}
