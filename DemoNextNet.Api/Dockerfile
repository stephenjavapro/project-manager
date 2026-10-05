FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

COPY DemoNextNet.Api/DemoNextNet.Api.csproj DemoNextNet.Api/
RUN dotnet restore DemoNextNet.Api/DemoNextNet.Api.csproj

COPY DemoNextNet.Api/ DemoNextNet.Api/
RUN dotnet publish DemoNextNet.Api/DemoNextNet.Api.csproj \
    --configuration Release \
    --output /app/publish \
    --no-restore

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app

ENV ASPNETCORE_HTTP_PORTS=8080
EXPOSE 8080

COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "DemoNextNet.Api.dll"]
