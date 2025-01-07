using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using backend.Models;
using backend.Data;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;

namespace backend.Services
{
    public class AuthService
    {
        private readonly ApplicationDBContext _context;
        private readonly IConfiguration _configuration;

        public AuthService(ApplicationDBContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        // Method to verify the password entered by the user during login
        public bool VerifyPassword(string email, string enteredPassword)
        {
            if (string.IsNullOrWhiteSpace(email) || string.IsNullOrWhiteSpace(enteredPassword))
                return false;

            var user = _context.Users.SingleOrDefault(u => u.Email == email);
            if (user == null)
            {
                return false; // User not found
            }

            var passwordHasher = new PasswordHasher<User>();
            var result = passwordHasher.VerifyHashedPassword(user, user.Password, enteredPassword);

            return result == PasswordVerificationResult.Success;
        }

        // Method to generate a JWT token after the user logs in
        public string GenerateJwtToken(User user)
        {
            if (user == null)
                throw new ArgumentNullException(nameof(user));


            var claims = new List<Claim>
    {
        new Claim("userId", user.UserId.ToString()),
        new Claim("email", user.Email)
    };


            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:SecretKey"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            // Create the JWT token
            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddHours(1),
                signingCredentials: creds
            );


            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        // Method to hash a password
        public string HashPassword(User user, string password)
        {
            if (user == null || string.IsNullOrWhiteSpace(password))
                throw new ArgumentException("User and password cannot be null or empty.");

            var passwordHasher = new PasswordHasher<User>();
            return passwordHasher.HashPassword(user, password);
        }

        // Method to register a new user with a hashed password
        public void RegisterUser(User user, string password)
        {
            if (user == null || string.IsNullOrWhiteSpace(password))
                throw new ArgumentException("User and password cannot be null or empty.");

            user.Password = HashPassword(user, password);
            _context.Users.Add(user);
            _context.SaveChanges();
        }
    }
}
