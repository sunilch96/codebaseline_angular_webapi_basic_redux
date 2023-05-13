using CodeBaseline.Api.App;
using CodeBaseline.Constants;
using CodeBaseline.Data.Entities;
using CodeBaseline.Data.Migrations;
using CodeBaseline.Model.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NuGet.Protocol.Core.Types;

namespace CodeBaseline.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CourseTilesMasterController : ControllerBase
    {
        private ApplicationDbContext _applicationDbContext;
        public CourseTilesMasterController(ApplicationDbContext applicationDbContext)
        {
            _applicationDbContext = applicationDbContext;
        }


        [HttpGet("{menuId}")]
        public IActionResult Course(int menuId)
        {
            if (menuId == 0)
            {
                ResponseModel responseModel = new ResponseModel();
                responseModel.Message = "Invalid Id.";
                responseModel.Status = Convert.ToString(StatusCodes.Status400BadRequest);
                responseModel.isProcessed = false;
                return BadRequest(responseModel);
            }

            var menuSubMenuResult = _applicationDbContext.MenuSubMenu.Where(m => m.MenuId == menuId).FirstOrDefault();
            _applicationDbContext.Entry(menuSubMenuResult).Collection(c => c.CourseTile).Load();

            MenuSubMenuModel menuSubMenu = new MenuSubMenuModel(menuSubMenuResult);

            List<CourseTilesModel> CourseSubCourses = new List<CourseTilesModel>();
            foreach (var dbCourseItem in menuSubMenuResult.CourseTile.Where(x => x.SubCourseId == null || x.SubCourseId == 0))
            {
                var CourseTilesModel = new CourseTilesModel(dbCourseItem);
                CourseTilesModel.IsContentAvailable = CheckIfContentExists(menuId, dbCourseItem.CourseId);

                if (menuSubMenuResult.CourseTile.Any(x => x.SubCourseId == dbCourseItem.CourseId))
                {
                    AddChildCourse(menuSubMenuResult.CourseTile, CourseTilesModel, dbCourseItem, menuId);
                }
                CourseSubCourses.Add(CourseTilesModel);
            }
            menuSubMenu.CourseTiles = CourseSubCourses;
            return Ok(menuSubMenu);
        }
        //recursive function
        private CourseTilesModel AddChildCourse(ICollection<CourseTilesEntity> CourseSubCoursesResult,
            CourseTilesModel CourseTilesModel, CourseTilesEntity dbCourseItem, int menuId)
        {
            foreach (var item in CourseSubCoursesResult.Where(x => x.SubCourseId == dbCourseItem.CourseId))
            {
                if (CourseTilesModel.ChildSubCourses == null)
                {
                    CourseTilesModel.ChildSubCourses = new List<CourseTilesModel>();
                }

                if (CourseSubCoursesResult.Any(x => x.SubCourseId == item.CourseId))
                {
                    var childSubCourse = AddChildCourse(CourseSubCoursesResult, new CourseTilesModel(item), item, menuId);
                    childSubCourse.IsContentAvailable = CheckIfContentExists(menuId, item.CourseId);
                    CourseTilesModel.ChildSubCourses.Add(childSubCourse);
                }
                else
                {
                    var childCourseTiles = new CourseTilesModel(item);
                    childCourseTiles.IsContentAvailable = CheckIfContentExists(menuId, item.CourseId);
                    CourseTilesModel.ChildSubCourses.Add(childCourseTiles);
                }
            }
            return CourseTilesModel;
        }

        private bool CheckIfContentExists(int menuId, int courseId)
        {
            //get parentAppFolder folder
            var parentAppFolder = BusinessConstants.AppSettings.ContentPath;
            //check for content directory
            var contentDirectory = parentAppFolder + "\\Content";
            var fileName = contentDirectory + "\\" + menuId + "\\" + courseId + "\\" + courseId + ".html"; ;
            if (!System.IO.File.Exists(fileName))
                return false;
            else
                return true;
        }

        // Get api/<CourseTilesMasterController>/course/5
        [HttpGet("course/{menuId}/{courseId}")]
        public IActionResult Get(int menuId, int courseId)
        {
            //ask user to remove child first, send error message
            var menuSubMenuResult = _applicationDbContext.MenuSubMenu.Where(m => m.MenuId == menuId).FirstOrDefault();
            var courseTiles = _applicationDbContext.CourseTiles.Where(c => c.CourseId == courseId).FirstOrDefault();

            ResponseModel responseModel = new ResponseModel();
            if (menuSubMenuResult == null || courseTiles == null)
            {
                responseModel.Message = "No record found";
                responseModel.Status = Convert.ToString(StatusCodes.Status404NotFound);
                responseModel.isProcessed = false;
                return BadRequest(responseModel);
            }

            MenuSubMenuModel menuSubMenu = new MenuSubMenuModel(menuSubMenuResult);
            menuSubMenu.CourseTile = new CourseTilesModel(courseTiles);
            return Ok(menuSubMenu);
        }

        //Add Menu/ Child Menu to existing Menu
        [HttpPost]
        public IActionResult Post([FromBody] CourseTilesModel courseTiles)
        {
            var menu = _applicationDbContext.MenuSubMenu
                .Where(x => x.MenuId == courseTiles.MenuId)
                .Include(c => c.CourseTile).FirstOrDefault();

            ResponseModel responseModel = new ResponseModel();
            if (menu == null)
            {
                responseModel.Message = "Unable to add record.";
                responseModel.Status = Convert.ToString(StatusCodes.Status400BadRequest);
                responseModel.isProcessed = false;
                return BadRequest(responseModel);
            }

            CourseTilesEntity courseTilesEntity = new CourseTilesEntity()
            {
                SubCourseId= courseTiles.SubCourseId,
                Name = courseTiles.Name,
                Description = courseTiles.Description,
                SequenceNumber = courseTiles.SequenceNumber,
                SortByDescending = courseTiles.SortByDescending,
                Url = courseTiles.Url,
                Enabled = courseTiles.Enabled,
                Created = courseTiles.Created,
                Updated = courseTiles.Updated,
            };

            menu.CourseTile.Add(courseTilesEntity);
            _applicationDbContext.Entry(menu).State = EntityState.Modified;
            _applicationDbContext.SaveChanges();
            
            responseModel.Message = "Record Added Successfully";
            responseModel.Status = Convert.ToString(StatusCodes.Status200OK);
            responseModel.isProcessed = true;

            return Ok(responseModel);
        }

        // PUT api/<CourseTilesMasterController>/5
        [HttpPut("{id}")]
        public IActionResult Put(int id, [FromBody] CourseTilesModel courseTiles)
        {
            var courseTile = _applicationDbContext.CourseTiles.SingleOrDefault(x => x.CourseId == id);
            ResponseModel responseModel = new ResponseModel();
            if (courseTile != null)
            {
                courseTile.SubCourseId = courseTiles.SubCourseId;
                courseTile.Name = courseTiles.Name;
                courseTile.Description = courseTiles.Description;
                courseTile.SequenceNumber = courseTiles.SequenceNumber;
                courseTile.SortByDescending = courseTiles.SortByDescending;
                courseTile.Url = courseTiles.Url;
                courseTile.Enabled = courseTiles.Enabled;
                courseTile.Created = courseTiles.Created;
                courseTile.Updated = courseTiles.Updated;

                _applicationDbContext.Entry(courseTile).State = EntityState.Modified;
                _applicationDbContext.SaveChanges();

                responseModel.Message = "Record Updated Successfully";
                responseModel.Status = Convert.ToString(StatusCodes.Status200OK);
                responseModel.isProcessed = true;

                return Ok(responseModel);
            }

            responseModel.Message = "Record Not Updated.";
            responseModel.Status = Convert.ToString(StatusCodes.Status200OK);
            responseModel.isProcessed = false;
            return StatusCode(StatusCodes.Status304NotModified, responseModel);
        }

        // DELETE api/<CourseTilesMasterController>/5
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            //ask user to remove child first, send error message
            var courseTile = _applicationDbContext.CourseTiles.SingleOrDefault(x => x.CourseId == id);
            var IfChildMenuExists = _applicationDbContext.CourseTiles.Any(x => x.SubCourseId == id);
            ResponseModel responseModel = new ResponseModel();
            if (courseTile != null && !IfChildMenuExists)
            {
                _applicationDbContext.CourseTiles.Remove(courseTile);
                _applicationDbContext.SaveChanges();

                responseModel.Message = "Record Deleted Successfully";
                responseModel.Status = Convert.ToString(StatusCodes.Status200OK);
                responseModel.isProcessed = true;
                return Ok(responseModel);
            }

            if (IfChildMenuExists)
            {
                responseModel.Message = "Child-Tiles exists for this Course, Delete Child Tile first.";
                responseModel.Status = Convert.ToString(StatusCodes.Status304NotModified);
                responseModel.isProcessed = false;
                return Ok(responseModel);
            }
            return StatusCode(StatusCodes.Status304NotModified, responseModel);
        }
    }
}
