using System.ComponentModel.DataAnnotations;

namespace Speedy_Fingers.Entities
{
    public class Matche
    {
        [Key]
        public string UserName { get; set; }
        public DateTime EnrollTime { get; set; } = DateTime.UtcNow;
        public string ConnectionId { get; set; }
    }
}
