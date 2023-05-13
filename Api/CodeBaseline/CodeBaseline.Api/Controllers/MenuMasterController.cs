using CodeBaseline.Api.App;
using CodeBaseline.Data.Entities;
using CodeBaseline.Model.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

namespace CodeBaseline.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MenuMasterController : ControllerBase
    {
        private ApplicationDbContext _applicationDbContext;
        public MenuMasterController(ApplicationDbContext applicationDbContext)
        {
            _applicationDbContext = applicationDbContext;
        }


        [HttpGet]
        public List<MenuSubMenuModel> Menu()
        {
            var menuListResult = _applicationDbContext.MenuSubMenu.Include(x=> x.Category).ToList(); 
            List<MenuSubMenuModel> menuSubMenus = new List<MenuSubMenuModel>();
            foreach (var dbMenuItem in menuListResult.Where(x=> x.SubMenuId == null || x.SubMenuId == 0))
            {
                var menuSubMenuModel = new MenuSubMenuModel(dbMenuItem);
                if(menuListResult.Any(x=> x.SubMenuId == dbMenuItem.MenuId))
                {
                    AppendChildMenu(menuListResult, menuSubMenuModel, dbMenuItem);
                }
                menuSubMenus.Add(menuSubMenuModel);
            }
            return menuSubMenus;
        }

        private MenuSubMenuModel AppendChildMenu( List<MenuSubMenuEntity> menuSubMenusResult,
            MenuSubMenuModel menuSubMenuModel, MenuSubMenuEntity dbMenuItem)
        {
            foreach(var item in menuSubMenusResult.Where(x=> x.SubMenuId == dbMenuItem.MenuId))
            {
                if(menuSubMenuModel.ChildSubMenuModels == null)
                {
                    menuSubMenuModel.ChildSubMenuModels= new List<MenuSubMenuModel>();
                }

                if(menuSubMenusResult.Any(x=> x.SubMenuId == item.MenuId))
                {
                    var childSubMenu = AppendChildMenu(menuSubMenusResult, new MenuSubMenuModel(item), item);
                    menuSubMenuModel.ChildSubMenuModels.Add(childSubMenu);
                }
                else
                {
                    menuSubMenuModel.ChildSubMenuModels.Add(new MenuSubMenuModel(item));
                }
            }
            return menuSubMenuModel;
        }

        //Get menu by id
        [HttpGet("{id}")]
        public IActionResult Menu(int id)
        {
            var menuListResult = _applicationDbContext.MenuSubMenu.Where(m=> m.MenuId == id).Include(c=> c.Category).FirstOrDefault();
            if(menuListResult != null)
            {
                MenuSubMenuModel menuSubMenus = new MenuSubMenuModel(menuListResult);
                return Ok(menuSubMenus);
            }
            ResponseModel responseModel = new ResponseModel();
            responseModel.Message = "No Record Found";
            responseModel.Status = Convert.ToString(StatusCodes.Status404NotFound);
            responseModel.isProcessed = false;
            return NotFound(responseModel);
        }

        //Add Menu/ Child Menu to existing Menu
        [HttpPost]
        public IActionResult Post([FromBody] MenuSubMenuModel menuSubMenu)
        {
            MenuSubMenuEntity menuSubMenuEntity = new MenuSubMenuEntity()
            {
                SubMenuId = menuSubMenu.SubMenuId,
                Name = menuSubMenu.Name,
                Description = menuSubMenu.Description,
                SequenceNumber= menuSubMenu.SequenceNumber,
                SortByDescending= menuSubMenu.SortByDescending,
                Url= menuSubMenu.Url,
                Enabled = menuSubMenu.Enabled,
                Created = menuSubMenu.Created,
                Updated = menuSubMenu.Updated,
            };
            _applicationDbContext.MenuSubMenu.Add(menuSubMenuEntity);
            _applicationDbContext.SaveChanges();

            ResponseModel responseModel = new ResponseModel();
            responseModel.Message = "Record Added Successfully";
            responseModel.Status = Convert.ToString(StatusCodes.Status200OK);
            responseModel.isProcessed = true;

            return Ok(responseModel);
        }

        // PUT api/<MenuMasterController>/5
        [HttpPut("{id}")]
        public IActionResult Put(int id, [FromBody] MenuSubMenuModel menuSubMenu)
        {
            var menu = _applicationDbContext.MenuSubMenu.SingleOrDefault(x => x.MenuId == id);
            var category  = _applicationDbContext.Categories.SingleOrDefault(x => x.Id== menuSubMenu.CategoriesId);
            ResponseModel responseModel = new ResponseModel();
            if (menu != null)
            {
                menu.SubMenuId = menuSubMenu.SubMenuId;
                menu.Name = menuSubMenu.Name;
                menu.Description = menuSubMenu.Description;
                menu.SequenceNumber = menuSubMenu.SequenceNumber;
                menu.SortByDescending = menuSubMenu.SortByDescending;
                menu.Url = menuSubMenu.Url;
                menu.Enabled = menuSubMenu.Enabled;                
                menu.Created = menuSubMenu.Created;
                menu.Updated = menuSubMenu.Updated;

                if (category != null)
                {
                    menu.Category = category;
                }

                _applicationDbContext.Entry(menu).State = EntityState.Modified;
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

        // DELETE api/<MenuMasterController>/5
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            //ask user to remove child first, send error message
            var menu = _applicationDbContext.MenuSubMenu.SingleOrDefault(x => x.MenuId == id);
            var IfChildMenuExists = _applicationDbContext.MenuSubMenu.Any(x => x.SubMenuId == id);
            ResponseModel responseModel = new ResponseModel();
            if (menu != null && !IfChildMenuExists)
            {
                _applicationDbContext.MenuSubMenu.Remove(menu);
                _applicationDbContext.SaveChanges();

                responseModel.Message = "Record Deleted Successfully";
                responseModel.Status = Convert.ToString(StatusCodes.Status200OK);
                responseModel.isProcessed = true;
                return Ok(responseModel);
            }
            
            if (IfChildMenuExists)
            {
                responseModel.Message = "Sub-Menu exists for this Menu, Delete Sub-Menu first.";
                responseModel.Status = Convert.ToString(StatusCodes.Status304NotModified);
                responseModel.isProcessed = false;
                return Ok(responseModel);
            }
            return StatusCode(StatusCodes.Status304NotModified, responseModel);
        }
    }
}
