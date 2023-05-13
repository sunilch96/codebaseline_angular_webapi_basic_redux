using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CodeBaseline.Data.Migrations
{
    public partial class Menu_Course_Category_cat : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_MenuSubMenu_MenuSubMenu_MenuSubMenuMenuId",
                table: "MenuSubMenu");

            migrationBuilder.RenameColumn(
                name: "MenuSubMenuMenuId",
                table: "MenuSubMenu",
                newName: "CategoriesId");

            migrationBuilder.RenameIndex(
                name: "IX_MenuSubMenu_MenuSubMenuMenuId",
                table: "MenuSubMenu",
                newName: "IX_MenuSubMenu_CategoriesId");

            migrationBuilder.AddForeignKey(
                name: "FK_MenuSubMenu_Categories_CategoriesId",
                table: "MenuSubMenu",
                column: "CategoriesId",
                principalTable: "Categories",
                principalColumn: "Id");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_MenuSubMenu_Categories_CategoriesId",
                table: "MenuSubMenu");

            migrationBuilder.RenameColumn(
                name: "CategoriesId",
                table: "MenuSubMenu",
                newName: "MenuSubMenuMenuId");

            migrationBuilder.RenameIndex(
                name: "IX_MenuSubMenu_CategoriesId",
                table: "MenuSubMenu",
                newName: "IX_MenuSubMenu_MenuSubMenuMenuId");

            migrationBuilder.AddForeignKey(
                name: "FK_MenuSubMenu_MenuSubMenu_MenuSubMenuMenuId",
                table: "MenuSubMenu",
                column: "MenuSubMenuMenuId",
                principalTable: "MenuSubMenu",
                principalColumn: "MenuId");
        }
    }
}
