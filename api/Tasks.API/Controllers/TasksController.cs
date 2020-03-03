using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
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
            _client = new HttpClient();
        }

        [HttpGet]
        public async Task<IEnumerable<CTask>> GetList()
        {
            var result = await _client.GetStringAsync(_url);
            var tasks = JsonConvert.DeserializeObject<List<CTask>>(result);

            return tasks;
        }

        [HttpGet("{id}")]
        public async Task<CTask> Get([FromRoute] int id)
        {
            var result = await _client.GetStringAsync($"{_url}/{id}");
            var task = JsonConvert.DeserializeObject<CTask>(result);

            return task;
        }
    }
}
