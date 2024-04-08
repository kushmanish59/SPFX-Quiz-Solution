using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System.Net.Http;
using System.Reflection.Metadata;
using System.Text;

namespace SPFXQuizTimeAPI
{
    public static class GetTimeAPI
    {
        private static readonly HttpClient httpClient = new HttpClient();

        [FunctionName("GetTimeAPI")]
        public static async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", "post", Route = null)] HttpRequest req,
            ILogger log)
        {
            log.LogInformation("C# HTTP trigger function processed a request.");

            try
            {
                string requestBody = await new StreamReader(req.Body).ReadToEndAsync();
                dynamic data = JsonConvert.DeserializeObject(requestBody);
                string reqAPIURL = data?.url;
                string contentBody = data?.content;
                var content = new StringContent(contentBody, Encoding.UTF8, "application/json");

                // Make the POST request
                var response = await httpClient.PostAsync(reqAPIURL, content);

                // Check if the request was successful
                if (response.IsSuccessStatusCode)
                {
                    // Read the response content
                    string responseContent = await response.Content.ReadAsStringAsync();

                    // Return the response
                    return new OkObjectResult(responseContent);
                }
                else
                {
                    // Log error if request was not successful
                    log.LogError($"Failed to call API. Status code: {response.StatusCode}");
                    return new StatusCodeResult(StatusCodes.Status500InternalServerError);
                }
            }
            catch (HttpRequestException ex)
            {
                log.LogError($"Error calling API: {ex.Message}");
                return new StatusCodeResult(StatusCodes.Status500InternalServerError);
            }
        }
    }
}
