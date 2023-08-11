using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Speedy_Fingers.Entities;
using System.Text.Json;

namespace Speedy_Fingers.Data
{
    public class Seed
    {
        public static async Task SeedUsers(UserManager<AppUser> userManager, RoleManager<IdentityRole> roleManager)
        {
            if (await userManager.Users.AnyAsync()) return;

            /////Seed Roles
            var roles = new List<IdentityRole>
            {
                new IdentityRole{Name = "User"},
                new IdentityRole{Name = "Admin"}
            };

            foreach (var role in roles)
            {
                await roleManager.CreateAsync(role);
            }

            /////Seed Admin
            var admin = new AppUser
            {
                UserName = "admin",
                Email = "speedy.fingers.management@gmail.com",
                EmailConfirmed = true,
            };
            await userManager.CreateAsync(admin, "Pa$$w0rd");
            await userManager.AddToRoleAsync(admin, "Admin");
        }
    }
}
