using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Quiz.api.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Quiz.api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    //[Authorize]
    public class UserProfileController : ControllerBase
    {
        private UserManager<User> _userManager;
        public UserProfileController(UserManager<User> userManager)
        {
            _userManager = userManager;
        }
        [HttpGet]
        [Authorize]
        //GET : /api/UserProfile
        public async Task<Object> GetUserProfile()
        {
            string userId = User.Claims.First(c => c.Type == "UserID").Value;
            var user = await _userManager.FindByIdAsync(userId);
            return new
            {
                user.FullName,
                user.Email,
                user.UserName
            };
        }
    }
}
