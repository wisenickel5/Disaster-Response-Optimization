# Official image as a parent image.
FROM mcr.microsoft.com/dotnet/aspnet:7.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

# Use the SDK image to build the app.
FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build
WORKDIR /src
COPY ["Disaster_Response_Optimization/Disaster_Response_Optimization.csproj", "Disaster_Response_Optimization/"]

# Copy other project references if needed
RUN dotnet restore "Disaster_Response_Optimization/Disaster_Response_Optimization.csproj"
COPY . .
WORKDIR "/src/Disaster_Response_Optimization"
RUN dotnet build "Disaster_Response_Optimization.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "Disaster_Response_Optimization.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Disaster_Response_Optimization.dll"]
