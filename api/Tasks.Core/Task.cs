using System;

namespace Tasks.Core
{
    public class Task
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int Priority { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime CompleteAt { get; set; }
        public int Status { get; set; }
    }
}
