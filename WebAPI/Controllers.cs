using Microsoft.AspNetCore.Mvc;
using Disaster_Response_Optimization.Infastructure;
using System.Runtime.InteropServices;
using Disaster_Response_Optimization.Infastructure.Data;

namespace Disaster_Response_Optimization.WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DisasterController : ControllerBase
    {
        private readonly IDisasterDeclarationService _service;

        public DisasterController(IDisasterDeclarationService service)
        {
            _service = service;
        }

        [HttpGet("{state}/{disasterType}")]
        public ActionResult<string> GetMajorDisasterZipCode(string state, string disasterType)
        {
            try
            {
                var zipCode = _service.GetMajorDisasterZipCode(state, disasterType);
                return Ok(zipCode);
            }
            catch (Exception ex)
            {
                // Log the exception details
                return StatusCode(500, ex.Message);
            }
        }
    }
}

