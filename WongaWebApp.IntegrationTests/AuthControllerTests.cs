using System.Net;
using System.Net.Http.Json;
using FluentAssertions;
using Wonga.Server.Models;

namespace WongaWebApp.IntegrationTests
{
    public class AuthControllerTests : IClassFixture<CustomWebApplicationFactory>
    {
        private readonly HttpClient _client;
        private readonly CustomWebApplicationFactory _factory;

        public AuthControllerTests(CustomWebApplicationFactory factory)
        {
            _factory = factory;
            _client = factory.CreateClient();
        }

        [Fact]
        public async Task Register_ValidUser_ReturnsSuccess()
        {
            var registerRequest = new RegisterRequest
            {
                FirstName = "Test",
                LastName = "User",
                Email = "test@example.com",
                Password = "Password123!"
            };

            var response = await _client.PostAsJsonAsync("/api/auth/register", registerRequest);

            response.StatusCode.Should().Be(HttpStatusCode.OK);
            var user = await response.Content.ReadFromJsonAsync<UserDto>();
            user.Should().NotBeNull();
            user.Email.Should().Be(registerRequest.Email);
        }

        [Fact]
        public async Task Register_DuplicateEmail_ReturnsBadRequest()
        {
            var registerRequest = new RegisterRequest
            {
                FirstName = "Test",
                LastName = "User",
                Email = "duplicate@example.com",
                Password = "Password123!"
            };

            await _client.PostAsJsonAsync("/api/auth/register", registerRequest);

            var response = await _client.PostAsJsonAsync("/api/auth/register", registerRequest);

            response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
        }

        [Fact]
        public async Task Login_ValidCredentials_ReturnsToken()
        {
            var registerRequest = new RegisterRequest
            {
                FirstName = "Login",
                LastName = "Test",
                Email = "login@example.com",
                Password = "Password123!"
            };
            await _client.PostAsJsonAsync("/api/auth/register", registerRequest);

            var loginRequest = new LoginRequest
            {
                Email = "login@example.com",
                Password = "Password123!"
            };

            var response = await _client.PostAsJsonAsync("/api/auth/login", loginRequest);

            response.StatusCode.Should().Be(HttpStatusCode.OK);
            var loginResponse = await response.Content.ReadFromJsonAsync<LoginResponse>();
            loginResponse.Should().NotBeNull();
            loginResponse.Token.Should().NotBeNullOrEmpty();
            loginResponse.User.Email.Should().Be(loginRequest.Email);
        }

        [Fact]
        public async Task Login_InvalidCredentials_ReturnsUnauthorized()
        {
            var loginRequest = new LoginRequest
            {
                Email = "nonexistent@example.com",
                Password = "wrongpassword"
            };

            var response = await _client.PostAsJsonAsync("/api/auth/login", loginRequest);

            response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
        }
    }
}