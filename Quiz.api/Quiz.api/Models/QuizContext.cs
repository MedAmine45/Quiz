using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Quiz.api.Models
{
    public class QuizContext : IdentityDbContext
    {
        public DbSet<User> Users { get; set; }

        public DbSet<Question> Questions { get; set; }

        public QuizContext(DbContextOptions options) : base(options)
        {

        }
     
    }
}
