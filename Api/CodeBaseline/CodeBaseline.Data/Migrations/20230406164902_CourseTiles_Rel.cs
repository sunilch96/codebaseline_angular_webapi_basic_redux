using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CodeBaseline.Data.Migrations
{
    public partial class CourseTiles_Rel : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_MenuSubMenu_CourseTiles_CourseTilesEntityCourseId",
                table: "MenuSubMenu");

            migrationBuilder.DropIndex(
                name: "IX_MenuSubMenu_CourseTilesEntityCourseId",
                table: "MenuSubMenu");

            migrationBuilder.DropColumn(
                name: "CourseTilesEntityCourseId",
                table: "MenuSubMenu");

            migrationBuilder.AddColumn<int>(
                name: "MenuSubMenuEntityMenuId",
                table: "CourseTiles",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_CourseTiles_MenuSubMenuEntityMenuId",
                table: "CourseTiles",
                column: "MenuSubMenuEntityMenuId");

            migrationBuilder.AddForeignKey(
                name: "FK_CourseTiles_MenuSubMenu_MenuSubMenuEntityMenuId",
                table: "CourseTiles",
                column: "MenuSubMenuEntityMenuId",
                principalTable: "MenuSubMenu",
                principalColumn: "MenuId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_CourseTiles_MenuSubMenu_MenuSubMenuEntityMenuId",
                table: "CourseTiles");

            migrationBuilder.DropIndex(
                name: "IX_CourseTiles_MenuSubMenuEntityMenuId",
                table: "CourseTiles");

            migrationBuilder.DropColumn(
                name: "MenuSubMenuEntityMenuId",
                table: "CourseTiles");

            migrationBuilder.AddColumn<int>(
                name: "CourseTilesEntityCourseId",
                table: "MenuSubMenu",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_MenuSubMenu_CourseTilesEntityCourseId",
                table: "MenuSubMenu",
                column: "CourseTilesEntityCourseId");

            migrationBuilder.AddForeignKey(
                name: "FK_MenuSubMenu_CourseTiles_CourseTilesEntityCourseId",
                table: "MenuSubMenu",
                column: "CourseTilesEntityCourseId",
                principalTable: "CourseTiles",
                principalColumn: "CourseId");
        }
    }
}
