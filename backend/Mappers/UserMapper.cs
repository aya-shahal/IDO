using backend.Dtos.User;
using backend.Models;
using backend.Services;

namespace backend.Mappers
{
    public static class UserMapper
    {
        public static UserDto ToUserDto(this User userModel)
        {
            if (userModel == null)
                throw new ArgumentNullException(nameof(userModel));

            return new UserDto
            {
                UserId = userModel.UserId,
                Email = userModel.Email,
            };
        }

        public static User ToUserFromCreateDto(this CreateUserRequestDto createUserRequestDto, AuthService authService)
        {
            if (createUserRequestDto == null || authService == null)
                throw new ArgumentNullException("Input parameters cannot be null.");

            var user = new User
            {
                Email = createUserRequestDto.Email
            };

            user.Password = authService.HashPassword(user, createUserRequestDto.Password);

            return user;
        }
    }
}
