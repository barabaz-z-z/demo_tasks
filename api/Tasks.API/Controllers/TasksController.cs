using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using CTask = Tasks.Core.Task;

namespace Tasks.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TasksController : ControllerBase
    {
        private readonly HttpClient _client;
        private readonly string _url = "https://api.fake.rest/93eb2014-8f83-4c55-b1b9-52140d4e3500/external/tasks";

        private readonly ILogger<TasksController> _logger;

        public TasksController(ILogger<TasksController> logger)
        {
            _logger = logger;
            _client = new HttpClient(); // needs using `using` or Dispose
        }

        [HttpGet]
        public async Task<IEnumerable<CTask>> GetList()
        {
            var result = await _client.GetStringAsync(_url);
            var tasks = Deserialize<List<CTask>>(result);

            return tasks;
        }

        [HttpGet("{id}")]
        public async Task<CTask> GetById([FromRoute] int id)
        {
            var result = await _client.GetStringAsync($"{_url}/get/{id}");
            var task = Deserialize<CTask>(result);

            return task;
        }

        [HttpPost]
        public async Task<ActionResult<CTask>> Create([FromBody] CTask newTask)
        {
            var content = new StringContent(JsonConvert.SerializeObject(newTask), Encoding.UTF8, "application/json");
            var response = await _client.PostAsync($"{_url}/create", content);
            var result = await response.Content.ReadAsStringAsync();
            var id = Deserialize<int>(result);

            return CreatedAtAction(nameof(GetById), new { Id = id }, newTask);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete([FromRoute] int id)
        {
            await _client.DeleteAsync($"{_url}/delete/{id}");

            return NoContent();
        }

        private static TResult Deserialize<TResult>(string json) where TResult : new()
        {
            var definition = new { Data = new TResult() };
            var response = JsonConvert.DeserializeAnonymousType(json, definition);

            return response.Data;
        }
    }
}
