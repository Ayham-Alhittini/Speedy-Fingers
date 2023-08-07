using System.ComponentModel.DataAnnotations;

namespace Speedy_Fingers.DTOs
{
    public class ResetPassword
    {
        [Required]
        public string Password { get; set; }
        public string Email { get; set; }
        public string Token { get; set; }

    }
}
