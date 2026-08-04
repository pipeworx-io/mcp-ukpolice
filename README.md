# mcp-ukpolice

UK Police MCP — wraps the UK Police Data API (free, no auth)

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 1394+ live data sources.

## Tools

| Tool | Description |
|------|-------------|
| `get_crimes` | Get street-level crimes near a latitude/longitude for a given month. Returns crime category, location, and outcome status. |
| `get_forces` | List all police forces in England, Wales, and Northern Ireland. Returns force ID and name. |
| `get_outcomes` | Get outcomes for crimes at a location for a given month. Returns outcome category and date for each crime. |

## Quick Start

Add to your MCP client (Claude Desktop, Cursor, Windsurf, etc.):

```json
{
  "mcpServers": {
    "ukpolice": {
      "url": "https://gateway.pipeworx.io/ukpolice/mcp"
    }
  }
}
```

Or connect to the full Pipeworx gateway for access to all 1394+ data sources:

```json
{
  "mcpServers": {
    "pipeworx": {
      "url": "https://gateway.pipeworx.io/mcp"
    }
  }
}
```

## Using with ask_pipeworx

Instead of calling tools directly, you can ask questions in plain English:

```
ask_pipeworx({ question: "your question about Ukpolice data" })
```

The gateway picks the right tool and fills the arguments automatically.

## More

- [Docs and guides](https://pipeworx.io/docs)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
