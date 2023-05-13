

using CodeBaseline.Model.Models;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using System.Xml.Linq;

namespace CodeBaseline.Constants
{
    public static class BusinessConstants
    {
        
        static BusinessConstants()
        {
            string appSettingsJson = File.ReadAllText( Path.Combine(Environment.CurrentDirectory, "appsettings.json"));
            AppSettings = JsonConvert.DeserializeObject<AppSettingsModel>(appSettingsJson);
        }
        public static AppSettingsModel AppSettings { get; set; }
    }
}