using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CodeBaseline.Data.Migrations
{
    public partial class mediaEntity_Categories : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_MenuSubMenu_Categories_CategoriesId",
                table: "MenuSubMenu");

            migrationBuilder.RenameColumn(
                name: "CategoriesId",
                table: "MenuSubMenu",
                newName: "CategoryId");

            migrationBuilder.RenameIndex(
                name: "IX_MenuSubMenu_CategoriesId",
                table: "MenuSubMenu",
                newName: "IX_MenuSubMenu_CategoryId");

            migrationBuilder.AddColumn<string>(
                name: "GroupName",
                table: "Categories",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Media",
                columns: table => new
                {
                    MediaId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    SubCourseId = table.Column<int>(type: "int", nullable: true),
                    Path = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Url = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Enabled = table.Column<bool>(type: "bit", nullable: true),
                    Created = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Updated = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CategoryId = table.Column<int>(type: "int", nullable: true),
                    CourseTilesEntityCourseId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Media", x => x.MediaId);
                    table.ForeignKey(
                        name: "FK_Media_Categories_CategoryId",
                        column: x => x.CategoryId,
                        principalTable: "Categories",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Media_CourseTiles_CourseTilesEntityCourseId",
                        column: x => x.CourseTilesEntityCourseId,
                        principalTable: "CourseTiles",
                        principalColumn: "CourseId");
                });

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: 1,
                column: "GroupName",
                value: "Menu");

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: 2,
                column: "GroupName",
                value: "Menu");

            migrationBuilder.UpdateData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: 3,
                column: "GroupName",
                value: "Application");

            migrationBuilder.InsertData(
                table: "Categories",
                columns: new[] { "Id", "CategoryDescription", "CategoryName", "GroupName" },
                values: new object[,]
                {
                    { 4, "All types of images", "Image", "Media" },
                    { 5, "All types of videos", "Video", "Media" },
                    { 6, "All types of audios", "Audio", "Media" },
                    { 7, "All types of documents", "Document", "Media" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_Media_CategoryId",
                table: "Media",
                column: "CategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_Media_CourseTilesEntityCourseId",
                table: "Media",
                column: "CourseTilesEntityCourseId");

            migrationBuilder.AddForeignKey(
                name: "FK_MenuSubMenu_Categories_CategoryId",
                table: "MenuSubMenu",
                column: "CategoryId",
                principalTable: "Categories",
                principalColumn: "Id");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_MenuSubMenu_Categories_CategoryId",
                table: "MenuSubMenu");

            migrationBuilder.DropTable(
                name: "Media");

            migrationBuilder.DeleteData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: 4);

            migrationBuilder.DeleteData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: 5);

            migrationBuilder.DeleteData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: 6);

            migrationBuilder.DeleteData(
                table: "Categories",
                keyColumn: "Id",
                keyValue: 7);

            migrationBuilder.DropColumn(
                name: "GroupName",
                table: "Categories");

            migrationBuilder.RenameColumn(
                name: "CategoryId",
                table: "MenuSubMenu",
                newName: "CategoriesId");

            migrationBuilder.RenameIndex(
                name: "IX_MenuSubMenu_CategoryId",
                table: "MenuSubMenu",
                newName: "IX_MenuSubMenu_CategoriesId");

            migrationBuilder.AddForeignKey(
                name: "FK_MenuSubMenu_Categories_CategoriesId",
                table: "MenuSubMenu",
                column: "CategoriesId",
                principalTable: "Categories",
                principalColumn: "Id");
        }
    }
}
