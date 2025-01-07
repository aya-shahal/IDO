using backend.Dtos.Todo;
using backend.Models;
using backend.Services;
using backend.Mappers;
using Microsoft.AspNetCore.Mvc;
using backend.Data;
using System.Linq;
using Microsoft.EntityFrameworkCore;
namespace backend.Controllers
{
    [Route("api/todo")]
    [ApiController]
    public class TodoController : ControllerBase
    {
        private readonly ApplicationDBContext _context;


        public TodoController(ApplicationDBContext context)
        {
            _context = context;
        }

        // GET
        [HttpGet]
        public IActionResult GetAll()
        {
            var todos = _context.ToDo
                .Select(t => t.ToToDoDto())
                .ToList();
            return Ok(todos);
        }


        // GETById

        [HttpGet("{id}")]
        public IActionResult GetById([FromRoute] int id)
        {
            var todo = _context.ToDo.Find(id);
            if (todo == null)
            {
                return NotFound();
            }
            return Ok(todo.ToToDoDto());
        }

        // GET: api/todo/user/{userId}
        [HttpGet("user/{userId}")]
        public IActionResult GetByUserId([FromRoute] int userId)
        {
            var todos = _context.ToDo
                .Where(t => t.UserId == userId)
                .Select(t => t.ToToDoDto())
                .ToList();

            if (todos.Count == 0)
            {
                return NotFound($"No ToDo items found for UserId {userId}.");
            }

            return Ok(todos);
        }

        // POST
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateToDoRequestDto createToDoRequestDto)
        {
            if (createToDoRequestDto == null)
            {
                return BadRequest("Invalid data.");
            }

            var userExists = await _context.Users.AnyAsync(u => u.UserId == createToDoRequestDto.UserId);
            if (!userExists)
            {
                return BadRequest("UserId does not exist.");
            }

            var todo = createToDoRequestDto.ToToDoFromCreateDto();

            _context.ToDo.Add(todo);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = todo.ToDoId }, todo.ToToDoDto());
        }


        // PUT
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateToDoRequestDto updateToDoRequestDto)
        {
            if (updateToDoRequestDto == null)
            {
                return BadRequest("Invalid data.");
            }


            var existingToDo = await _context.ToDo.FindAsync(id);
            if (existingToDo == null)
            {
                return NotFound($"ToDo with ID {id} not found.");
            }


            var updatedToDo = updateToDoRequestDto.ToToDoFromUpdateDto(existingToDo);

            _context.Entry(updatedToDo).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return Ok(updatedToDo.ToToDoDto());
        }

        // DELETE
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var todo = await _context.ToDo.FindAsync(id);
            if (todo == null)
            {
                return NotFound($"ToDo with ID {id} not found.");
            }

            _context.ToDo.Remove(todo);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
