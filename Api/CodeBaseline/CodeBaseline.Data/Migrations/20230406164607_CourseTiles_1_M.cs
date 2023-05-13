using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CodeBaseline.Data.Migrations
{
    public partial class CourseTiles_1_M : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_MenuSubMenu_CourseTiles_CourseTileCourseId",
                table: "MenuSubMenu");

            migrationBuilder.RenameColumn(
                name: "CourseTileCourseId",
                table: "MenuSubMenu",
                newName: "CourseTilesEntityCourseId");

            migrationBuilder.RenameIndex(
                name: "IX_MenuSubMenu_CourseTileCourseId",
                table: "MenuSubMenu",
                newName: "IX_MenuSubMenu_CourseTilesEntityCourseId");

            migrationBuilder.AddForeignKey(
                name: "FK_MenuSubMenu_CourseTiles_CourseTilesEntityCourseId",
                table: "MenuSubMenu",
                column: "CourseTilesEntityCourseId",
                principalTable: "CourseTiles",
                principalColumn: "CourseId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_MenuSubMenu_CourseTiles_CourseTilesEntityCourseId",
                table: "MenuSubMenu");

            migrationBuilder.RenameColumn(
                name: "CourseTilesEntityCourseId",
                table: "MenuSubMenu",
                newName: "CourseTileCourseId");

            migrationBuilder.RenameIndex(
                name: "IX_MenuSubMenu_CourseTilesEntityCourseId",
                table: "MenuSubMenu",
                newName: "IX_MenuSubMenu_CourseTileCourseId");

            migrationBuilder.AddForeignKey(
                name: "FK_MenuSubMenu_CourseTiles_CourseTileCourseId",
                table: "MenuSubMenu",
                column: "CourseTileCourseId",
                principalTable: "CourseTiles",
                principalColumn: "CourseId");
        }
    }
}
