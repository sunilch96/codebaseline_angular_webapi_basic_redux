using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CodeBaseline.Data.Migrations
{
    public partial class CateGory_Linked : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Categories_MenuSubMenu_MenuSubMenuMenuId",
                table: "Categories");

            migrationBuilder.DropIndex(
                name: "IX_Categories_MenuSubMenuMenuId",
                table: "Categories");

            migrationBuilder.DropColumn(
                name: "MenuSubMenuMenuId",
                table: "Categories");

            migrationBuilder.AddColumn<int>(
                name: "MenuSubMenuMenuId",
                table: "MenuSubMenu",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_MenuSubMenu_MenuSubMenuMenuId",
                table: "MenuSubMenu",
                column: "MenuSubMenuMenuId");

            migrationBuilder.AddForeignKey(
                name: "FK_MenuSubMenu_MenuSubMenu_MenuSubMenuMenuId",
                table: "MenuSubMenu",
                column: "MenuSubMenuMenuId",
                principalTable: "MenuSubMenu",
                principalColumn: "MenuId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_MenuSubMenu_MenuSubMenu_MenuSubMenuMenuId",
                table: "MenuSubMenu");

            migrationBuilder.DropIndex(
                name: "IX_MenuSubMenu_MenuSubMenuMenuId",
                table: "MenuSubMenu");

            migrationBuilder.DropColumn(
                name: "MenuSubMenuMenuId",
                table: "MenuSubMenu");

            migrationBuilder.AddColumn<int>(
                name: "MenuSubMenuMenuId",
                table: "Categories",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Categories_MenuSubMenuMenuId",
                table: "Categories",
                column: "MenuSubMenuMenuId");

            migrationBuilder.AddForeignKey(
                name: "FK_Categories_MenuSubMenu_MenuSubMenuMenuId",
                table: "Categories",
                column: "MenuSubMenuMenuId",
                principalTable: "MenuSubMenu",
                principalColumn: "MenuId");
        }
    }
}
