using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Models
{
    public enum ToDoStatus
    {
        ToDo,
        Doing,
        Done
    }
    public enum Important
    {
        High,
        Medium,
        Low
    }


    public class ToDo
    {
        public int ToDoId { get; set; }
        public int UserId { get; set; }
        public string Title { get; set; }
        public string Category { get; set; }
        public string Estimate { get; set; }
        public DateTime? DueDate { get; set; }
        public string TaskImportance { get; set; } = Important.Medium.ToString();
        public string Status { get; set; } = ToDoStatus.ToDo.ToString();
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; }
        public User User { get; set; }
    }

}
