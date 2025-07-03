# Script de prueba para servicios Go
Write-Host "==================================="
Write-Host "   PROBANDO SERVICIOS GO"
Write-Host "==================================="
Write-Host ""

# Probar Movie Service
Write-Host "1. Probando Movie Service (Puerto 8083)..."
try {
    $movieResponse = Invoke-WebRequest -Uri "http://localhost:8083/api/movies" -Method GET
    Write-Host "✅ Movie Service - Status: $($movieResponse.StatusCode)" -ForegroundColor Green
    $movies = $movieResponse.Content | ConvertFrom-Json
    Write-Host "   Películas encontradas: $($movies.Count)" -ForegroundColor Green
} catch {
    Write-Host "❌ Movie Service - Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Probar géneros de películas
Write-Host "2. Probando géneros de películas..."
try {
    $genresResponse = Invoke-WebRequest -Uri "http://localhost:8083/api/movies/genres" -Method GET
    Write-Host "✅ Géneros - Status: $($genresResponse.StatusCode)" -ForegroundColor Green
    $genres = $genresResponse.Content | ConvertFrom-Json
    Write-Host "   Géneros: $($genres -join ', ')" -ForegroundColor Green
} catch {
    Write-Host "❌ Géneros - Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Probar User Service - Obtener usuarios
Write-Host "3. Probando User Service - Obtener usuarios..."
try {
    $usersResponse = Invoke-WebRequest -Uri "http://localhost:8081/api/users" -Method GET
    Write-Host "✅ User Service - Status: $($usersResponse.StatusCode)" -ForegroundColor Green
    $users = $usersResponse.Content | ConvertFrom-Json
    Write-Host "   Usuarios encontrados: $($users.Count)" -ForegroundColor Green
} catch {
    Write-Host "❌ User Service - Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "   Respuesta: $($_.Exception.Response.StatusCode)" -ForegroundColor Yellow
}

Write-Host ""

# Probar registro de usuario
Write-Host "4. Probando registro de usuario..."
try {
    $registerBody = @{
        username = "testuser"
        email = "test@example.com"
        password = "123456"
    } | ConvertTo-Json

    $registerResponse = Invoke-WebRequest -Uri "http://localhost:8081/api/auth/register" -Method POST -ContentType "application/json" -Body $registerBody
    Write-Host "✅ Registro - Status: $($registerResponse.StatusCode)" -ForegroundColor Green
    $registerResult = $registerResponse.Content | ConvertFrom-Json
    Write-Host "   Usuario creado: $($registerResult.user.username)" -ForegroundColor Green
} catch {
    Write-Host "❌ Registro - Error: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        $errorStream = $_.Exception.Response.GetResponseStream()
        $reader = New-Object System.IO.StreamReader($errorStream)
        $errorBody = $reader.ReadToEnd()
        Write-Host "   Detalle: $errorBody" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "==================================="
Write-Host "   PRUEBAS COMPLETADAS"
Write-Host "===================================" 