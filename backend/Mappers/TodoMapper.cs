using backend.Dtos.Todo;
using backend.Models;
using backend.Services;
using System;

namespace backend.Mappers
{
    public static class TodoMapper
    {
        public static ToDoDto ToToDoDto(this ToDo todoModel)
        {
            if (todoModel == null)
                throw new ArgumentNullException(nameof(todoModel));

            return new ToDoDto
            {

                ToDoId = todoModel.ToDoId,
                Title = todoModel.Title,
                Category = todoModel.Category,
                Status = todoModel.Status,
                DueDate = todoModel.DueDate,
                TaskImportance = todoModel.TaskImportance,
                Estimate = todoModel.Estimate,
                CreatedAt = todoModel.CreatedAt
            };
        }

        //  CreateToDoRequestDto 
        public static ToDo ToToDoFromCreateDto(this CreateToDoRequestDto createToDoRequestDto)
        {
            if (createToDoRequestDto == null)
                throw new ArgumentNullException(nameof(createToDoRequestDto));

            return new ToDo
            {
                UserId = createToDoRequestDto.UserId,
                Title = createToDoRequestDto.Title,
                Category = createToDoRequestDto.Category,
                Estimate = createToDoRequestDto.Estimate,
                TaskImportance = createToDoRequestDto.TaskImportance.ToString(),
                Status = createToDoRequestDto.Status.ToString(),
                DueDate = createToDoRequestDto.DueDate,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };
        }


        // UpdateToDoRequestDto 
        public static ToDo ToToDoFromUpdateDto(this UpdateToDoRequestDto updateToDoRequestDto, ToDo existingToDo)
        {
            if (updateToDoRequestDto == null)
                throw new ArgumentNullException(nameof(updateToDoRequestDto));
            if (existingToDo == null)
                throw new ArgumentNullException(nameof(existingToDo));

            existingToDo.Title = updateToDoRequestDto.Title ?? existingToDo.Title;
            existingToDo.Category = updateToDoRequestDto.Category ?? existingToDo.Category;
            existingToDo.Estimate = updateToDoRequestDto.Estimate ?? existingToDo.Estimate;
            existingToDo.TaskImportance = updateToDoRequestDto.TaskImportance ?? existingToDo.TaskImportance;
            existingToDo.Status = updateToDoRequestDto.Status ?? existingToDo.Status;

            return existingToDo;
        }
    }
}
