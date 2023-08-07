using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Speedy_Fingers.Data;
using Speedy_Fingers.DTOs;
using Speedy_Fingers.Entities;
using Speedy_Fingers.Extensions;
using Speedy_Fingers.Helper;
using Speedy_Fingers.Interfaces;
using System.ComponentModel.DataAnnotations;
using System.Web;

namespace Speedy_Fingers.Controllers
{
    public class AccountController : BaseApiController
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly IEmailService _emailService;
        private readonly ITokenService _tokenService;
        private readonly DataContext _context;
        private readonly IWebHostEnvironment _env;
        private readonly IMapper _mapper;
        public AccountController(UserManager<AppUser> userManager,
            IEmailService emailService,
            ITokenService tokenService,
            DataContext context,
            IWebHostEnvironment env,
            IMapper mapper)
        {
            _userManager = userManager;
            _emailService = emailService;
            _tokenService = tokenService;
            _context = context;
            _env = env;
            _mapper = mapper;
        }

        [AllowAnonymous]
        [HttpGet("current-user")]
        public ActionResult CurrentUser()
        {
            return Ok(User.GetUsername());
        }

        [AllowAnonymous]
        [HttpPost("Register")]
        public async Task<ActionResult> Register(RegisterDto registerUser)
        {
            //check user not exist
            var _user = await _userManager.Users.Where(user => user.Email == registerUser.Email || user.UserName == registerUser.Username)
                .FirstOrDefaultAsync();

            if (_user != null)
            {
                if (_user.UserName == registerUser.Username)
                {
                    return BadRequest("User name taken");
                }

                return BadRequest("Email taken!");
            }


            ///adding user
            var user = new AppUser
            {
                UserName = registerUser.Username,
                Email = registerUser.Email,
                PasswordHash = registerUser.Password,
                EmailConfirmed = true ////to speed up testing
            };

            var result = await _userManager.CreateAsync(user, registerUser.Password);

            if (!result.Succeeded)
            {
                return BadRequest(result.Errors);
            }

            var roleResult = await _userManager.AddToRoleAsync(user, "User");
            if (!roleResult.Succeeded)
            {
                return BadRequest(roleResult.Errors);
            }

            ///add token to verify email
            var token = await _userManager.GenerateEmailConfirmationTokenAsync(user);
            var confirmationLink = Url.Action(nameof(ConfirmEmail), "Account", new { token, email = user.Email });
            var message = new EmailMessage(new string[] { user.Email! }, "Confirmation email link", GetUrl() + confirmationLink!);
            _emailService.SendEmail(message);

            return Ok();
        }


        [AllowAnonymous]
        [HttpGet("ConfirmEmail")]
        public async Task<ActionResult> ConfirmEmail(string token, string email)
        {
            var user = await _userManager.FindByEmailAsync(email);
            if (user == null)
            {
                return NotFound("User not exist");
            }
            var result = await _userManager.ConfirmEmailAsync(user, token);
            if (!result.Succeeded)
            {
                return BadRequest(result.Errors);
            }

            return Redirect(GetUrl() + "/email-confirmed");
        }

        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
        {
            var user = await _context.Users.Where(user => user.UserName == loginDto.LoginProvider || user.Email == loginDto.LoginProvider).FirstOrDefaultAsync();

            if (user == null)
            {
                return Unauthorized("invalid login provider");
            }
            if (!user.EmailConfirmed)
            {
                return Unauthorized("You must confirm you email to log in");
            }

            var result = await _userManager.CheckPasswordAsync(user, loginDto.Password);

            if (!result) return Unauthorized("Invalid Password");

            UserDto userDto = new UserDto
            {
                Username = user.UserName,
                Email = user.Email,
                Token = await _tokenService.CreateToken(user)
            };

            return Ok(userDto);
        }

        [HttpPost("resend-confirm-email/{email}")]
        public async Task<ActionResult> ResendConfirmEmail(string email)
        {

            var user = await _userManager.FindByEmailAsync(email);
            if (user == null)
            {
                return NotFound("User not exist");
            }
            if (user.EmailConfirmed)
            {
                return BadRequest("Email already confirmed!!!");
            }
            ///add token to verify email
            var token = await _userManager.GenerateEmailConfirmationTokenAsync(user);
            var confirmationLink = Url.Action(nameof(ConfirmEmail), "Account", new { token, email = user.Email });
            var message = new EmailMessage(new string[] { user.Email! }, "Confirmation email link", GetUrl() + confirmationLink!);
            _emailService.SendEmail(message);

            return Ok();
        }

        [AllowAnonymous]
        [HttpPost("forgot-password")]
        public async Task<ActionResult> ForgotPassword([Required] string email)
        {
            var user = await _userManager.FindByEmailAsync(email);
            if (user == null)
            {
                return NotFound("User not exist");
            }
            var token = await _userManager.GeneratePasswordResetTokenAsync(user);

            //var forgotPasswordLink = GetUrl() + "/reset-password?token=" + HttpUtility.UrlEncode(token) + "&email=" + email;
            var forgotPasswordLink = GetUrl() + "/reset-password?token=" + token + "&email=" + email;

            var message = new EmailMessage(new string[] { user.Email! }, "Password Reset link", forgotPasswordLink);
            _emailService.SendEmail(message);
            return Ok();
        }

        [AllowAnonymous]
        [HttpPost("reset-password")]
        public async Task<ActionResult> ResetPassword(ResetPassword resetPassword)
        {
            var user = await _userManager.FindByEmailAsync(resetPassword.Email);
            if (user == null)
            {
                return NotFound("User not exist");
            }
            var resetPasswordResult = await _userManager.ResetPasswordAsync(user, resetPassword.Token, resetPassword.Password);
            if (!resetPasswordResult.Succeeded)
            {
                return BadRequest(resetPasswordResult.Errors);
            }
            return Ok();
        }



        [Authorize]
        [HttpPost("change-password")]
        public async Task<ActionResult> ChangePassword(ChangePasswordDto changePassword)
        {
            var user = await _userManager.FindByIdAsync(User.GetUserId());
            
            if (changePassword.CurrentPassword == changePassword.NewPassword)
            {
                return BadRequest("New password must be different than old password");
            }
            var changePasswordResult = await _userManager.ChangePasswordAsync(user, changePassword.CurrentPassword, changePassword.NewPassword);
            if (!changePasswordResult.Succeeded)
            {
                return BadRequest(changePasswordResult.Errors);
            }
            return Ok();
        }

        [Authorize]
        [HttpGet("profile")]
        public async Task<ActionResult> Profile()
        {
            var user = await _context.Users.FindAsync(User.GetUserId());
            var profile = new DTOs.ProfileDto
            {
                Id  = user.Id,
                UserName = user.UserName,
                MemberSince = user.MemberSince,
                KeyboardLayout = user.KeyboardLayout,
                TypedWords = user.TypedWords,
                TakenTests = user.TakenTests,
                CompetitionsTaken = user.CompetitionsTaken,
                CompetitionsWon = user.CompetitionsWon,
                LowestWPM = user.LowestWPM,
                SumWPM = user.SumWPM,
                HighestWPM = user.HighestWPM,
            };

            return Ok(profile);
        }


        [Authorize]
        [HttpGet("update-keyboard-layout")]
        public async Task<ActionResult> UpdateKeyboardLayout([FromQuery][Required]string newLayout)
        {
            var user = await _userManager.FindByIdAsync(User.GetUserId());
            user.KeyboardLayout = newLayout;

            await _context.SaveChangesAsync();

            return Ok();
        }

        private string GetUrl()
        {
            return _env.IsDevelopment() ? "https://localhost:7124" : "production url is not yet exist";
        }
    }
}
