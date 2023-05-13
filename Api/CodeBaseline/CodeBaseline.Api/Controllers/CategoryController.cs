using CodeBaseline.Constants;
using CodeBaseline.Data.Entities;
using CodeBaseline.Model.Models;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace CodeBaseline.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoryController : ControllerBase
    {
        private ApplicationDbContext _applicationDbContext;
        public CategoryController(ApplicationDbContext applicationDbContext)
        {
            _applicationDbContext = applicationDbContext;
        }
        // GET: api/<CategoryController>
        [HttpGet]
        public IEnumerable<CategoriesEntity> Get()
        {
            return _applicationDbContext.Categories.ToList();
        }
    }
}
