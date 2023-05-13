using CodeBaseline.Api.App;
using CodeBaseline.Data.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Net;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace CodeBaseline.Api.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class PostController : ControllerBase
    {
        private ApplicationDbContext _applicationDbContext;
        public PostController(ApplicationDbContext applicationDbContext)
        {
            _applicationDbContext = applicationDbContext;
        }
        // GET: api/<PostController>
        [HttpGet]
        public IEnumerable<PostsEntity> Get()
        {
            return _applicationDbContext.Posts.ToList();
        }

        // GET api/<PostController>/5
        [HttpGet("{id}")]
        public PostsEntity? Get(int id)
        {
            return _applicationDbContext.Posts.FirstOrDefault(x => x.Id == id);
        }

        // POST api/<PostController>
        [HttpPost]
        public IActionResult Post([FromBody] PostsEntity postsEntity)
        {
            var result = _applicationDbContext.Posts.Add(postsEntity);
            _applicationDbContext.SaveChanges();
            return Ok(result.Entity);
        }

        // PUT api/<PostController>/5
        [HttpPut("{id}")]
        public IActionResult Put(int id, [FromBody] PostsEntity postsEntity)
        {
            var post = _applicationDbContext.Posts.SingleOrDefault(x => x.Id == id);
            if(post != null)
            {
                post.Id = id;
                post.Title = postsEntity.Title;
                post.Description = postsEntity.Description;
                _applicationDbContext.Entry(post).State = EntityState.Modified;
                _applicationDbContext.SaveChanges();
                return Ok(post);
            }
            return this.StatusCode(StatusCodes.Status304NotModified, post);
        }

        // DELETE api/<PostController>/5
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var post = _applicationDbContext.Posts.SingleOrDefault(x => x.Id == id);
            if (post != null)
            {
                _applicationDbContext.Posts.Remove(post);
                _applicationDbContext.SaveChanges();
                return Ok(post);
            }
            return this.StatusCode(StatusCodes.Status304NotModified, post);
        }
    }
}
