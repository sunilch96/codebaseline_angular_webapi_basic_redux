using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CodeBaseline.Model.Models
{
    public class AppSettingsModel
    {
        public ConnectionStrings ConnectionStrings { get; set; }
        public string ContentPath { get; set; }
    }
    public class ConnectionStrings
    {
        public string ConnStr { get; set; }
    }
}
