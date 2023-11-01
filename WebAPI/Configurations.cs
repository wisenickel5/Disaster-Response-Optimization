using System;
using Google.Cloud.SecretManager.V1;

namespace Disaster_Response_Optimization.WebAPI.Configurations
{
    public class GoogleMapsConfig
    {
        public string? ApiKey { get; set; }
    }

    public class GoogleSecretManager
    {
        public static string AccessSecret(string secretId, string projectId = "disaster-reponse-optimization")
        {
            SecretManagerServiceClient client = SecretManagerServiceClient.Create();
            SecretVersionName secretVer = new SecretVersionName(projectId, secretId, "latest");

            AccessSecretVersionResponse result = client.AccessSecretVersion(secretVer);

            string payload = result.Payload.Data.ToStringUtf8();
            return payload;
        }
    }
}

