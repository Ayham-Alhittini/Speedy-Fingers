using System.ComponentModel.DataAnnotations;

namespace Speedy_Fingers.DTOs
{
    public class ChangePasswordDto
    {
        [Required(ErrorMessage = "Current Password is required")]
        public string CurrentPassword { get; set; }


        [Required(ErrorMessage = "New Password is required")]
        public string NewPassword { get; set; }
    }
}
