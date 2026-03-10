using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using FluentAssertions;
using Wonga.Server.Models;

namespace WongaWebApp.IntegrationTests
{
    public class UsersControllerTests : IClassFixture<CustomWebApplicationFactory>
    {
        private readonly HttpClient _client;
        private readonly CustomWebApplicationFactory _factory;

        public UsersControllerTests(CustomWebApplicationFactory factory)
        {
            _factory = factory;
            _client = factory.CreateClient();
        }

        [Fact]
        public async Task GetCurrentUser_Authenticated_ReturnsUser()
        {
            // Arrange - register and login to get token
            var registerRequest = new RegisterRequest
            {
                FirstName = "Auth",
                LastName = "User",
                Email = "auth@example.com",
                Password = "Password123!"
            };
            await _client.PostAsJsonAsync("/api/auth/register", registerRequest);

            var loginRequest = new LoginRequest
            {
                Email = "auth@example.com",
                Password = "Password123!"
            };
            var loginResponse = await _client.PostAsJsonAsync("/api/auth/login", loginRequest);
            var loginResult = await loginResponse.Content.ReadFromJsonAsync<LoginResponse>();
            var token = loginResult.Token;

            // Act - call /api/users with token
            var request = new HttpRequestMessage(HttpMethod.Get, "/api/users/users");
            request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);
            var response = await _client.SendAsync(request);

            // Assert
            response.StatusCode.Should().Be(HttpStatusCode.OK);
            var user = await response.Content.ReadFromJsonAsync<UserDto>();
            user.Should().NotBeNull();
            user.Email.Should().Be("auth@example.com");
        }

        [Fact]
        public async Task GetCurrentUser_Unauthenticated_ReturnsUnauthorized()
        {
            // Act
            var response = await _client.GetAsync("/api/users/users");

            // Assert
            response.StatusCode.Should().Be(HttpStatusCode.Unauthorized);
        }
    }
}