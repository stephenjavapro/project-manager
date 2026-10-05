# DemoNextNet

DemoNextNet is a project and task manager with a Next.js frontend and an
ASP.NET Core Web API backed by SQL Server.

## Repository structure

```text
.
├── DemoNextNet.Api/
│   ├── Controllers/       # Projects, tasks, and user-settings API endpoints
│   ├── Data/              # Entity Framework Core DbContext
│   ├── Migrations/        # Database schema migrations
│   ├── Models/            # Project, task, settings, and priority models
│   ├── Program.cs         # API services, CORS, Swagger, and route setup
│   └── DemoNextNet.Api.csproj
└── demonnextnet-ui/
    ├── public/             # Static frontend assets
    └── src/
        ├── app/            # Next.js App Router pages and layouts
        ├── components/     # Project, task, form, and shared UI components
        ├── context/        # Shared settings context
        ├── hooks/          # Project and task data hooks
        ├── lib/            # API client
        ├── styles/         # Global styles and variables
        └── types/          # Shared TypeScript types
```

The API targets .NET 10 and uses Entity Framework Core with SQL Server. The
frontend uses Next.js 16, React 19, TypeScript, and Sass modules.

## Prerequisites

- .NET 10 SDK
- Node.js and npm
- A running SQL Server instance accessible to the API (for example, SQL Server
  running in Docker Desktop)
- The `dotnet-ef` tool for applying migrations

There is no repository-level .NET solution file. Run .NET and npm commands
from their project directories as shown below.

## Configure the database

Docker Desktop is the interface for managing containers; opening it does not
mean SQL Server has stopped or needs to be started again. Check that the SQL
Server container is running (for example, in Docker Desktop or with
`docker ps`). If it is already running with port 1433 published to the host,
no further database startup step is needed. The API running on your computer
can connect to it at `localhost,1433`. The API reads its connection string from
`ConnectionStrings:DefaultConnection`.

If you need to configure the connection locally, use .NET user secrets to keep
credentials out of source control:

```sh
cd DemoNextNet.Api
dotnet user-secrets init
dotnet user-secrets set "ConnectionStrings:DefaultConnection" "Server=localhost,1433;Database=DemoNextNet;User Id=sa;Password=REPLACE_WITH_YOUR_PASSWORD;TrustServerCertificate=True"
```

If `dotnet ef` is not installed, install the .NET 10 EF Core tool:

```sh
dotnet tool install --global dotnet-ef --version 10.0.12
```

Apply the checked-in migrations to create or update the database:

```sh
dotnet ef database update
```

Run this command from `DemoNextNet.Api/`.

## Run the applications

### Local development (SQL Server in Docker, API on your computer)

1. Confirm your SQL Server container is running in Docker Desktop. If it is
   stopped, start it there. Make sure it publishes the database port used by
   your connection string (commonly host port 1433).
2. In a terminal, start the API as a local .NET process:

   ```sh
   cd DemoNextNet.Api
   dotnet run
   ```

   The `http` launch profile is selected by default. The API listens at
   `http://localhost:5106`; Swagger UI is at `http://localhost:5106/swagger`.
3. In another terminal, start the frontend:

   ```sh
   cd demonnextnet-ui
   npm ci
   npm run dev
   ```

Open `http://localhost:3000`. The frontend defaults to the API at
`http://localhost:5106`, and the API's CORS policy allows this local frontend
origin.

### Optional: run the API itself in Docker

The repository also includes `DemoNextNet.Api/Dockerfile` and `compose.yaml` if
you want to containerize the API rather than run it with `dotnet run`. First
copy `.env.example` to `.env` and set the database connection string, then
start the API container:

```sh
cp .env.example .env
docker compose up --build
```

When SQL Server runs on the host and the API runs in Docker, use
`host.docker.internal` rather than `localhost` in the container's database
connection string. Compose publishes the API at `http://localhost:5106`. Stop
it with `Ctrl+C`, or use `docker compose down` to stop and remove the container.

## Build and lint

Build the API:

```sh
cd DemoNextNet.Api
dotnet build
```

To build and run the API in Docker instead, use `docker compose up --build` as
shown above.

Build and lint the frontend:

```sh
cd demonnextnet-ui
npm run build
npm run lint
```

Run the production frontend after building:

```sh
npm run start
```

## Using the app

- Create projects with a name, priority, due date, description, and optional
  tasks.
- Expand a project to view tasks, and toggle task completion.
- Edit or delete projects, close and reopen projects, and adjust the due-date
  warning period in settings.
- Closed projects appear in a separate Closed section.

The API's main routes are:

| Resource | Routes |
| --- | --- |
| Projects | `GET` and `POST /api/projectitems`; `GET`, `PUT`, and `DELETE /api/projectitems/{id}` |
| Project status | `PATCH /api/projectitems/{id}/toggle-status` |
| Tasks | `GET` and `POST /api/taskitems`; `GET`, `PUT`, and `DELETE /api/taskitems/{id}` |
| Task completion | `PATCH /api/taskitems/{id}/toggle` |
| User settings | `GET` and `PATCH /api/usersettings` |

Swagger is enabled when the API runs in the Development environment.
=======
# project-manager
A project manager demo app utlizing .NET and NextJS