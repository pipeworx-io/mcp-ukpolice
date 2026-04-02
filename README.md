# @pipeworx/mcp-ukpolice

MCP server for UK Police crime data

## Tools

| Tool | Description |
|------|-------------|
| `get_crimes` | Get street-level crimes near a latitude/longitude for a given month |
| `get_forces` | List all police forces in England, Wales, and Northern Ireland |
| `get_outcomes` | Get crime outcomes at a location for a given month |

## Quickstart (Pipeworx Gateway)

```bash
curl -X POST https://gateway.pipeworx.io/mcp \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "tools/call",
    "params": {
      "name": "get_crimes",
      "arguments": { "lat": 51.5074, "lng": -0.1278, "date": "2024-01" }
    }
  }'
```

## License

MIT
