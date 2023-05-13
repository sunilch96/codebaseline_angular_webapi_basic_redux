using CodeBaseline.Data.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CodeBaseline.Model.Models
{
    public class MenuSubMenuModel
    {
        public MenuSubMenuModel()
        {

        }
        public MenuSubMenuModel(MenuSubMenuEntity menuSubMenu)
        {
            this.MenuId = menuSubMenu.MenuId;
            this.SubMenuId = menuSubMenu.SubMenuId;
            this.Name = menuSubMenu.Name;
            this.Description = menuSubMenu.Description;
            this.SequenceNumber = menuSubMenu.SequenceNumber;
            this.SortByDescending = menuSubMenu.SortByDescending;
            this.Url = menuSubMenu.Url;
            this.Enabled = menuSubMenu.Enabled;
            this.Created= menuSubMenu.Created;
            this.Updated= menuSubMenu.Updated;

            if (menuSubMenu?.Category !=null)
            {
                this.CategoriesId = menuSubMenu.Category.Id;
                this.Category = new CategoriesModel(menuSubMenu.Category);
            }
        }
        public int MenuId{ get; set; }
        public int? SubMenuId { get; set; }
        public string? Name { get; set; }
        public string? Description { get; set; }
        public int? SequenceNumber { get; set; }
        public bool? SortByDescending { get; set; }
        public string? Url { get; set; }
        public bool? Enabled { get; set; }
        public DateTime? Created { get; set; }
        public DateTime? Updated { get; set; }
        public int? CategoriesId { get; set; }
        public CategoriesModel? Category { get; set; }
        public List<MenuSubMenuModel>? ChildSubMenuModels { get; set; }
        public List<CourseTilesModel>? CourseTiles { get; set; }
        public CourseTilesModel? CourseTile { get; set; }

    }
}
