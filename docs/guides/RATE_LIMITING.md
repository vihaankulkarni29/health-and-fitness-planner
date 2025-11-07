# Rate Limiting Implementation

## Overview

Rate limiting has been implemented across the API to prevent abuse and ensure fair usage of resources. We use the `slowapi` library which provides a simple, flexible rate limiting solution for FastAPI applications.

## Configuration

Rate limits are configured via environment variables and can be customized per deployment:

### Environment Variables

```bash
# Storage backend (use Redis in production)
RATE_LIMIT_STORAGE_URI="memory://"  # Development
# RATE_LIMIT_STORAGE_URI="redis://localhost:6379"  # Production

# Rate limit configurations
RATE_LIMIT_AUTH="5 per minute"      # Login, register
RATE_LIMIT_WRITE="10 per minute"    # Create, update, delete
RATE_LIMIT_READ="100 per minute"    # Read operations
RATE_LIMIT_STRICT="3 per minute"    # Extra strict (user registration)
```

### Global Default
- **1000 requests per hour** - Applied to all endpoints not explicitly limited

## Rate Limited Endpoints

### Authentication Endpoints
| Endpoint | Method | Limit | Reason |
|----------|--------|-------|--------|
| `/api/v1/auth/login/access-token` | POST | 5/min | Prevent brute force attacks |

### Registration Endpoints
| Endpoint | Method | Limit | Reason |
|----------|--------|-------|--------|
| `/api/v1/trainees/` | POST | 3/min | Prevent spam registrations |

### Trainer Management (Admin only)
| Endpoint | Method | Limit | Reason |
|----------|--------|-------|--------|
| `/api/v1/trainers/` | POST | 10/min | Prevent resource exhaustion |
| `/api/v1/trainers/{id}` | PUT | 10/min | Prevent abuse |
| `/api/v1/trainers/{id}` | DELETE | 10/min | Prevent accidental mass deletion |

## IP Address Detection

The rate limiter uses intelligent IP detection:

1. **X-Forwarded-For Header**: Checks first (for proxy/load balancer scenarios)
2. **Direct Client IP**: Falls back to request.client.host

This ensures accurate rate limiting even behind reverse proxies (nginx, CloudFlare, etc.).

## Response Headers

When rate limited, responses include:

```
HTTP/1.1 429 Too Many Requests
X-RateLimit-Limit: 5
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1699276800
Retry-After: 60
```

## Client-Side Handling

Clients should:

1. **Check Response Headers**: Monitor `X-RateLimit-Remaining`
2. **Respect Retry-After**: Wait specified seconds before retrying
3. **Implement Exponential Backoff**: For 429 responses
4. **Show User Feedback**: "Too many attempts, please wait X seconds"

## Production Deployment

### Using Redis

For production, configure Redis as the storage backend:

```python
# In docker-compose.yml
services:
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

  backend:
    environment:
      - RATE_LIMIT_STORAGE_URI=redis://redis:6379
```

### Benefits of Redis
- **Distributed**: Works across multiple backend instances
- **Persistent**: Survives application restarts
- **Performant**: Handles high-volume rate limit checks efficiently

## Security Benefits

✅ **Brute Force Protection**: Login endpoint limited to 5/min prevents password guessing
✅ **Spam Prevention**: Registration limited to 3/min prevents bot abuse  
✅ **DoS Mitigation**: Global 1000/hour limit prevents resource exhaustion
✅ **Fair Usage**: Ensures no single client monopolizes API resources

## Monitoring

Track rate limit metrics:

```python
# Example metrics to collect
- rate_limit_hits_total{endpoint="/auth/login"}
- rate_limit_blocks_total{endpoint="/auth/login"}
- client_blocked_duration_seconds
```

## Testing

Rate limiting is tested in integration tests:

```python
# Test login rate limiting
for i in range(6):
    response = client.post("/api/v1/auth/login/access-token", ...)
    if i < 5:
        assert response.status_code in [200, 401]  # Normal or wrong credentials
    else:
        assert response.status_code == 429  # Rate limited
```

## Future Enhancements

1. **User-Based Limits**: Different limits for authenticated vs anonymous users
2. **Endpoint Categories**: Group similar endpoints with shared limits
3. **Dynamic Limits**: Adjust based on system load
4. **Whitelist**: Bypass limits for trusted IPs (monitoring tools, health checks)
5. **Analytics Dashboard**: Visualize rate limit patterns and abuse attempts

## Architecture

```
Request → Nginx/CloudFlare
    ↓
X-Forwarded-For Header Added
    ↓
FastAPI Application
    ↓
SlowAPI Middleware
    ↓
Check IP Against Redis/Memory Store
    ↓
429 (Too Many Requests) OR Continue to Handler
```

## References

- [SlowAPI Documentation](https://github.com/laurentS/slowapi)
- [Redis Rate Limiting Patterns](https://redis.io/topics/streams-intro)
- [OWASP API Security - Rate Limiting](https://owasp.org/www-project-api-security/)
