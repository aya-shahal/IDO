using backend.Dtos.User;
using backend.Models;
using backend.Services;
using backend.Mappers;
using Microsoft.AspNetCore.Mvc;
using backend.Data;
using System.Linq;

namespace backend.Controllers
{
    [Route("api/user")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly ApplicationDBContext _context;
        private readonly AuthService _authService;

        public UserController(ApplicationDBContext context, AuthService authService)
        {
            _context = context;
            _authService = authService;
        }

        [HttpGet]
        public IActionResult GetAll()
        {
            var users = _context.Users
                .Select(u => u.ToUserDto())
                .ToList();
            return Ok(users);
        }

        [HttpGet("{id}")]
        public IActionResult GetById([FromRoute] int id)
        {
            var user = _context.Users.Find(id);
            if (user == null)
            {
                return NotFound();
            }
            return Ok(user.ToUserDto());
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequestDto loginDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var user = _context.Users.SingleOrDefault(u => u.Email == loginDto.Email);
            if (user == null || !_authService.VerifyPassword(loginDto.Email, loginDto.Password))
            {
                return Unauthorized("Invalid email or password.");
            }

            var token = _authService.GenerateJwtToken(user);
            return Ok(new { Token = token });
        }

        [HttpPost("register")]
        public IActionResult Register([FromBody] RegisterRequestDto registerDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (_context.Users.Any(u => u.Email == registerDto.Email))
            {
                return Conflict("Email is already in use.");
            }

            // Create new User instance and hash the password
            var user = new User
            {
                Email = registerDto.Email,
                Password = _authService.HashPassword(new User(), registerDto.Password)
            };

            _authService.RegisterUser(user, registerDto.Password);

            var createdUser = _context.Users.SingleOrDefault(u => u.Email == user.Email);

            return CreatedAtAction(nameof(GetById), new { id = createdUser.UserId }, createdUser.ToUserDto());
        }
    }
}
