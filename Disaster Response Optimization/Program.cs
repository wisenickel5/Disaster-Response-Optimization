using Disaster_Response_Optimization.WebAPI.Configurations;
using Disaster_Response_Optimization.Infastructure.Data;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddRazorPages();

// Register the Disaster Declaration service with the dependency injection container.
builder.Services.AddScoped<IDisasterDeclarationService, DisasterDeclarationService>(serviceProvider =>
{
    var configuration = serviceProvider.GetService<IConfiguration>();
    var filePath = configuration.GetValue<string>("DisasterDeclarationsFilePath");
    return new DisasterDeclarationService(filePath);
});

// Configure CORS to allow requests from the frontend origin.
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowMyOrigin",
    builder => builder.WithOrigins("http://localhost:7057")
                       .AllowAnyMethod()
                       .AllowAnyHeader());
});

// Configure Google Maps API key
var googleMapsApiKey = GoogleSecretManager.AccessSecret("gm-api");
builder.Services.Configure<GoogleMapsConfig>(config =>
{
    config.GoogleMapsApiKey = googleMapsApiKey;
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error");
    app.UseHsts();
}

app.UseCors("AllowMyOrigin");

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseAuthorization();

app.MapRazorPages();
app.MapControllers();

app.Run();
