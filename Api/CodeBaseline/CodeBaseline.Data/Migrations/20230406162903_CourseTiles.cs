using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CodeBaseline.Data.Migrations
{
    public partial class CourseTiles : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "CourseTileCourseId",
                table: "MenuSubMenu",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "Created",
                table: "MenuSubMenu",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "Updated",
                table: "MenuSubMenu",
                type: "datetime2",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "CourseTiles",
                columns: table => new
                {
                    CourseId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    SubCourseId = table.Column<int>(type: "int", nullable: true),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SequenceNumber = table.Column<int>(type: "int", nullable: true),
                    SortByDescending = table.Column<bool>(type: "bit", nullable: true),
                    Url = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Enabled = table.Column<bool>(type: "bit", nullable: true),
                    Created = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Updated = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CourseTiles", x => x.CourseId);
                });

            migrationBuilder.CreateIndex(
                name: "IX_MenuSubMenu_CourseTileCourseId",
                table: "MenuSubMenu",
                column: "CourseTileCourseId");

            migrationBuilder.AddForeignKey(
                name: "FK_MenuSubMenu_CourseTiles_CourseTileCourseId",
                table: "MenuSubMenu",
                column: "CourseTileCourseId",
                principalTable: "CourseTiles",
                principalColumn: "CourseId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_MenuSubMenu_CourseTiles_CourseTileCourseId",
                table: "MenuSubMenu");

            migrationBuilder.DropTable(
                name: "CourseTiles");

            migrationBuilder.DropIndex(
                name: "IX_MenuSubMenu_CourseTileCourseId",
                table: "MenuSubMenu");

            migrationBuilder.DropColumn(
                name: "CourseTileCourseId",
                table: "MenuSubMenu");

            migrationBuilder.DropColumn(
                name: "Created",
                table: "MenuSubMenu");

            migrationBuilder.DropColumn(
                name: "Updated",
                table: "MenuSubMenu");
        }
    }
}
