using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace Quiz.api.Models
{
    public class Question
    {
        [Key]
        public int QuestionID { get; set; }
        [Column(TypeName = "nvarchar(250)")]
        public string QuestionDescription { get; set; }

        public string Choix { get; set; }
        public int NumQuestion { get; set; }
        public string QuestionType { get; set; }

        public bool QuestionEtat { get; set; }
    }
}
