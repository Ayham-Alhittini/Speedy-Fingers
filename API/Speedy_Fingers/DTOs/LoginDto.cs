using System.ComponentModel.DataAnnotations;

namespace Speedy_Fingers.DTOs
{
    public class LoginDto
    {
        [Required(ErrorMessage = "Login Provider is required")]
        public string LoginProvider { get; set; }

        [Required(ErrorMessage = "Password is required")]
        public string Password { get; set; }
    }
}
