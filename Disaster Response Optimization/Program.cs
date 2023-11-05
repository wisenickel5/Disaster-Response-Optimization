using Microsoft.Extensions.Configuration;
using Disaster_Response_Optimization.WebAPI.Configurations;

var builder = WebApplication.CreateBuilder(args);

var googleMapsApiKey = GoogleSecretManager.AccessSecret("gm-api");

// Add services to the container.
builder.Services.AddRazorPages();

builder.Services.Configure<GoogleMapsConfig>(config =>
{
    config.ApiKey = googleMapsApiKey;
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseAuthorization();

app.MapRazorPages();

app.Run();
