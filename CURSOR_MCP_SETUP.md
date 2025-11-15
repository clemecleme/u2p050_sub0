# Setting Up Penpot MCP in Cursor IDE

## Step 1: Create Your .env File

Create a `.env` file in this directory with your Penpot credentials:

```env
PENPOT_API_URL=https://design.penpot.app/api
PENPOT_USERNAME=your_penpot_username
PENPOT_PASSWORD=your_penpot_password
PORT=5000
DEBUG=true
```

**To get your Penpot credentials:**
1. Go to https://penpot.app and sign up/log in
2. Use your account username and password

## Step 2: Configure Cursor MCP Settings

1. Open Cursor Settings (Ctrl+, or Cmd+,)
2. Search for "MCP" or go to Features → Model Context Protocol
3. Click "Edit Config" or find your MCP settings file

On Windows, the config is typically at:
`%APPDATA%\Cursor\User\globalStorage\settings.json`

Add this configuration:

```json
{
  "mcpServers": {
    "penpot": {
      "command": "uvx",
      "args": ["penpot-mcp"],
      "env": {
        "PENPOT_API_URL": "https://design.penpot.app/api",
        "PENPOT_USERNAME": "your_penpot_username",
        "PENPOT_PASSWORD": "your_penpot_password"
      }
    }
  }
}
```

**Important:** Replace `your_penpot_username` and `your_penpot_password` with your actual credentials.

## Step 3: Install and Test

Run this command to install the Penpot MCP server:

```bash
uvx penpot-mcp
```

## Step 4: Restart Cursor

After adding the MCP configuration, restart Cursor IDE to activate the connection.

## Verification

Once configured, you can use the Penpot MCP server through Cursor's AI assistant to:
- List your Penpot projects
- Access design files
- Query design elements
- Manipulate designs programmatically

## Troubleshooting

- **Authentication errors:** Double-check your username and password in the `.env` file
- **Connection errors:** Ensure you have internet access and the Penpot API is reachable
- **MCP not showing:** Make sure you've restarted Cursor after adding the configuration







