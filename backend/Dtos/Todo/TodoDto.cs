using System;
using System.Collections.Generic;
using System.Linq;
using backend.Models;
using System.ComponentModel;

namespace backend.Dtos.Todo
{
    public class ToDoDto
    {
        public int ToDoId { get; set; }
        public string Title { get; set; }
        public string Category { get; set; }
        public string Status { get; set; }
        public DateTime? DueDate { get; set; }
        public string Estimate { get; set; }
        public string TaskImportance { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public class CreateToDoRequestDto
    {
        public int UserId { get; set; }
        public string Title { get; set; }
        public string Category { get; set; }
        public string Estimate { get; set; }
        public DateTime? DueDate { get; set; }
        [DefaultValue("ToDo")]
        public string Status { get; set; } = ToDoStatus.ToDo.ToString();
        public string TaskImportance { get; set; } = Important.Medium.ToString();
    }
    public class UpdateToDoRequestDto
    {
        public string? Title { get; set; }
        public string? Category { get; set; }
        public string? Estimate { get; set; }
        public string? Status { get; set; }
        public string? TaskImportance { get; set; }
        public string? DueDate { get; set; }
    }

}