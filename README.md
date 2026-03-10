# Wonga Authentication App

## How to Run Locally
- **Backend**
  - `cd WongaWebApp.Server`
  - `dotnet restore`
  - Update `appsettings.json` with your PostgreSQL connection string
  - `dotnet ef database update`
  - `dotnet run` → runs at https://localhost:7177

- **Frontend**
  - `cd wongawebapp.client`
  - `npm install`
  - `npm run dev` → runs at https://localhost:5173

## How to Run with Docker
- Ensure Docker Desktop is running
- In project root: `docker-compose up --build`
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## How It Works
- Register with name, email, password → stored in PostgreSQL (hashed password)
- Login returns JWT token → stored in sessionStorage (cleared when browser closes)
- Dashboard shows user info + profile picture (upload/remove on hover)
- Protected API endpoints require JWT in Authorization header

## Running Tests
- Local: `dotnet test WongaWebApp.IntegrationTests`
- Docker: `docker-compose run --rm tests`

## Environment Variables (for production/Docker)
- `ConnectionStrings__DefaultConnection` – PostgreSQL connection
- `Jwt__Key` – secret for signing tokens
