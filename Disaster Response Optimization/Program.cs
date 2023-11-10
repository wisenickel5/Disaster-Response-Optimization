using Microsoft.Extensions.Configuration;
using Disaster_Response_Optimization.WebAPI.Configurations;
using Disaster_Response_Optimization.Infastructure.Data;

var builder = WebApplication.CreateBuilder(args);

var googleMapsApiKey = GoogleSecretManager.AccessSecret("gm-api");

// Add services to the container.
builder.Services.AddRazorPages();

// Register the Disaster Declaration interface and service with the dependency injection container.
builder.Services.AddScoped<IDisasterDeclarationService, DisasterDeclarationService>(serviceProvider =>
{
    var configuration = serviceProvider.GetService<IConfiguration>();
    var filePath = configuration.GetValue<string>("DisasterDeclarationsFilePath");
    return new DisasterDeclarationService(filePath);
});

// Becauses API and frontend are served from different origins, we need to
// configure CORS in to allow requests from your frontend's origin.
// This can be done by adding the CORS middleware and configuring it with
// the appropriate policy.
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowMyOrigin",
    builder => builder.WithOrigins("http://localhost:7057")
                       .AllowAnyMethod()
                       .AllowAnyHeader());
});

builder.Services.Configure<GoogleMapsConfig>(config =>
{
    config.GoogleMapsApiKey = googleMapsApiKey;
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseCors("AllowMyOrigin");
app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseAuthorization();

app.MapRazorPages();

app.Run();
