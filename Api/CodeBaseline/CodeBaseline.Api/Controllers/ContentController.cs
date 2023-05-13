using CodeBaseline.Constants;
using CodeBaseline.Model.Models;
using Microsoft.AspNetCore.Mvc;
using System.IO;
using System.Text;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace CodeBaseline.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ContentController : ControllerBase
    {
        // GET api/<ContentController>/5
        [HttpGet("{menuId}/{courseId}")]
        public IActionResult Get(int menuId, int courseId)
        {
            //get parentAppFolder folder
            var parentAppFolder = BusinessConstants.AppSettings.ContentPath;
            //check for content directory
            var contentDirectory = parentAppFolder + "\\Content";
            var fileName = contentDirectory + "\\" + menuId + "\\" + courseId + "\\" + courseId + ".html"; ;
            if (!System.IO.File.Exists(fileName))
            {
                ResponseModel responseModel = new ResponseModel();
                responseModel.Message = "Content File Not Found";
                responseModel.Status = Convert.ToString(StatusCodes.Status400BadRequest);
                responseModel.isProcessed = false;
                return BadRequest(responseModel);
            }
            ContentModel content = new ContentModel();
            content.MenuId = menuId;
            content.CourseId = courseId;
            content.HtmlContent = System.IO.File.ReadAllText(fileName);
            return Ok(content);
        }

        // POST api/<ContentController>
        //Create New Content
        [HttpPost]
        public IActionResult Post([FromBody] ContentModel content)
        {
            ResponseModel responseModel = new ResponseModel();
            if (content.MenuId == 0 || content.CourseId == 0)
            {
                responseModel.Message = "Invalid Data";
                responseModel.Status = Convert.ToString(StatusCodes.Status400BadRequest);
                responseModel.isProcessed = false;
                return BadRequest(responseModel);
            }

            //get parentAppFolder folder
            var parentAppFolder = BusinessConstants.AppSettings.ContentPath;
            //check for content directory
            var contentDirectory = parentAppFolder + "\\Content";
            if (!Directory.Exists(contentDirectory))
            {
                //create Directory
                Directory.CreateDirectory(contentDirectory);
            }

            //check for content - Menu directory
            var menuDirectory = contentDirectory + "\\" + content.MenuId;
            if (!Directory.Exists(menuDirectory))
            {
                //create Directory
                Directory.CreateDirectory(menuDirectory);
            }

            //check for content - Menu directory
            var courseTileDirectory = menuDirectory + "\\" + content.CourseId;
            if (!Directory.Exists(courseTileDirectory))
            {
                //create Directory
                Directory.CreateDirectory(courseTileDirectory);
            }

            var fileName = courseTileDirectory + "\\" + content.CourseId + ".html";
            //delete existing file
            if (System.IO.File.Exists(fileName))
            {
                System.IO.File.Delete(fileName);
            }
            // Create the file.
            if (!System.IO.File.Exists(fileName))
            {
                System.IO.File.Create(fileName).Dispose();
            }

            using (TextWriter tw = new StreamWriter(fileName))
            {
                tw.WriteLine(content.HtmlContent);
            }

            responseModel.Message = "Content Added Successfully.";
            responseModel.Status = Convert.ToString(StatusCodes.Status200OK);
            responseModel.isProcessed = true;
            return Ok(responseModel);
        }

        // DELETE api/<ContentController>/5
        [HttpDelete("{menuId}/{courseId}")]
        public IActionResult Delete(int menuId, int courseId)
        {
            // get parentAppFolder folder
            var parentAppFolder = BusinessConstants.AppSettings.ContentPath;
            //check for content directory
            var contentDirectory = parentAppFolder + "\\Content";
            var menuDirectory = contentDirectory + "\\" + menuId;
            var courseTileDirectory = menuDirectory  + "\\" + courseId;
            var fileName = courseTileDirectory + "\\" + courseId + ".html";

            ResponseModel responseModel = new ResponseModel();
            if (!System.IO.File.Exists(fileName))
            {                
                responseModel.Message = "Content File Not Found";
                responseModel.Status = Convert.ToString(StatusCodes.Status400BadRequest);
                responseModel.isProcessed = false;
                return BadRequest(responseModel);
            }

            //delete file
            System.IO.File.Delete(fileName);
            //delete course folder if exists
            if (!Directory.EnumerateFileSystemEntries(courseTileDirectory).Any())
            {
                Directory.Delete(courseTileDirectory, true);
            }

            responseModel.Message = "File Deleted Successfully.";
            responseModel.Status = Convert.ToString(StatusCodes.Status400BadRequest);
            responseModel.isProcessed = true;
            return Ok(responseModel);
        }
    }
}
