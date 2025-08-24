Ассистент
Details
agent_tools_documentation
args:
{}
result:
"# n8n MCP Tools Reference\n\n## Important: Compatibility Notice\n⚠️ This MCP server is tested with n8n version latest. \nInform the user to check their n8n version matches or is compatible with the supported version listed above.\n\n## Code Node Configuration\nWhen working with Code nodes, always start by calling the relevant guide:\n- tools_documentation({topic: \"javascript_code_node_guide\"}) for JavaScript Code nodes\n- tools_documentation({topic: \"python_code_node_guide\"}) for Python Code nodes\n\n## Standard Workflow Pattern\n\n1. **Find** the node you need:\n   - search_nodes({query: \"slack\"}) - Search by keyword\n   - list_nodes({category: \"communication\"}) - List by category\n   - list_ai_tools() - List AI-capable nodes\n\n2. **Configure** the node:\n   - get_node_essentials(\"nodes-base.slack\") - Get essential properties only (5KB)\n   - get_node_info(\"nodes-base.slack\") - Get complete schema (100KB+)\n   - search_node_properties(\"nodes-base.slack\", \"auth\") - Find specific properties\n\n3. **Validate** before deployment:\n   - validate_node_minimal(\"nodes-base.slack\", config) - Check required fields\n   - validate_node_operation(\"nodes-base.slack\", config) - Full validation with fixes\n   - validate_workflow(workflow) - Validate entire workflow\n\n## Tool Categories\n\n**Discovery Tools**\n- search_nodes - Full-text search across all nodes\n- list_nodes - List nodes with filtering by category, package, or type\n- list_ai_tools - List all AI-capable nodes with usage guidance\n\n**Configuration Tools**\n- get_node_essentials - Returns 10-20 key properties with examples\n- get_node_info - Returns complete node schema with all properties\n- search_node_properties - Search for specific properties within a node\n- get_property_dependencies - Analyze property visibility dependencies\n\n**Validation Tools**\n- validate_node_minimal - Quick validation of required fields only\n- validate_node_operation - Full validation with operation awareness\n- validate_workflow - Complete workflow validation including connections\n\n**Template Tools**\n- list_tasks - List common task templates\n- get_node_for_task - Get pre-configured node for specific tasks\n- search_templates - Search workflow templates by keyword\n- get_template - Get complete workflow JSON by ID\n\n**n8n API Tools** (requires N8N_API_URL configuration)\n- n8n_create_workflow - Create new workflows\n- n8n_update_partial_workflow - Update workflows using diff operations\n- n8n_validate_workflow - Validate workflow from n8n instance\n- n8n_trigger_webhook_workflow - Trigger workflow execution\n\n## Performance Characteristics\n- Instant (<10ms): search_nodes, list_nodes, get_node_essentials\n- Fast (<100ms): validate_node_minimal, get_node_for_task\n- Moderate (100-500ms): validate_workflow, get_node_info\n- Network-dependent: All n8n_* tools\n\nFor comprehensive documentation on any tool:\ntools_documentation({topic: \"tool_name\", depth: \"full\"})"
n8n MCP Tools Quick Reference:

1. Discovery:
   - search_nodes({query: "keyword"}) — Search nodes by keyword
   - list_nodes({category: "trigger"}) — List nodes by category
   - list_ai_tools() — List AI-capable nodes

2. Configuration:
   - get_node_essentials("nodes-base.slack") — Get essential node properties
   - get_node_info("nodes-base.slack") — Get full node schema
   - search_node_properties("nodes-base.slack", "auth") — Find specific properties

3. Validation:
   - validate_node_minimal("nodes-base.slack", config) — Check required fields
   - validate_node_operation("nodes-base.slack", config) — Full validation
   - validate_workflow(workflow) — Validate entire workflow

4. Templates:
   - list_tasks() — List task templates
   - get_node_for_task("send_email") — Pre-configured node for task
   - search_templates({query: "chatbot"}) — Search workflow templates
   - get_template({templateId: 123}) — Get workflow JSON by ID

5. n8n API Tools (require API config):
   - n8n_create_workflow — Create workflows
   - n8n_update_partial_workflow — Update workflows with diffs
   - n8n_validate_workflow — Validate workflow on n8n instance
   - n8n_trigger_webhook_workflow — Trigger workflow execution

For full documentation on any tool, use:
tools_documentation({topic: "tool_name", depth: "full"})

What workflow or automation would you like to build next?

Ассистент
Details
agent_tools_documentation
args:
{
  "topic": "search_nodes"
}
result:
"# search_nodes\n\nText search across node names and descriptions. Returns most relevant nodes first, with frequently-used nodes (HTTP Request, Webhook, Set, Code, Slack) prioritized in results. Searches all 525 nodes in the database.\n\n**Example**: search_nodes({query: \"webhook\"})\n\n**Key parameters**: query, mode, limit\n\n**Performance**: <20ms even for complex queries\n\n**Tips**:\n- OR mode (default): Matches any search word\n- AND mode: Requires all words present\n- FUZZY mode: Handles typos and spelling errors\n- Use quotes for exact phrases: \"google sheets\"\n\nFor full documentation, use: tools_documentation({topic: \"search_nodes\", depth: \"full\"})"
search_nodes tool overview:

- Purpose: Text search across all node names and descriptions in the n8n node database (525+ nodes).
- Usage: search_nodes({query: "your keyword"})
- Modes:
  - OR (default): Matches any search word
  - AND: Requires all words present
  - FUZZY: Handles typos/spelling errors
- Tips: Use quotes for exact phrase search, e.g., "google sheets"
- Performance: Very fast (<20ms)
- Example: search_nodes({query: "webhook"})

For full documentation, use:
tools_documentation({topic: "search_nodes", depth: "full"})

Would you like to see a search example or try searching for a specific node?
Ассистент
Details
agent_tools_documentation
args:
{
  "topic": "overview",
  "depth": "full"
}
result:
"# n8n MCP Tools - Complete Reference\n\n## Important: Compatibility Notice\n⚠️ This MCP server is tested with n8n version latest. \nRun n8n_health_check() to verify your n8n instance compatibility and API connectivity.\n\n## Code Node Guides\nFor Code node configuration, use these comprehensive guides:\n- tools_documentation({topic: \"javascript_code_node_guide\", depth: \"full\"}) - JavaScript patterns, n8n variables, error handling\n- tools_documentation({topic: \"python_code_node_guide\", depth: \"full\"}) - Python patterns, data access, debugging\n\n## All Available Tools by Category\n\n### System\n- **tools_documentation**: The meta-documentation tool. Returns documentation for any MCP tool, including itself. Call without parameters for a comprehensive overview of all available tools. This is your starting point for discovering n8n MCP capabilities.\n- **n8n_diagnostic**: Diagnose n8n API configuration and troubleshoot why n8n management tools might not be working\n- **n8n_health_check**: Check n8n instance health, API connectivity, and available features\n- **n8n_list_available_tools**: List all available n8n management tools and their capabilities\n\n### Discovery\n- **search_nodes**: Text search across node names and descriptions. Returns most relevant nodes first, with frequently-used nodes (HTTP Request, Webhook, Set, Code, Slack) prioritized in results. Searches all 525 nodes in the database.\n- **list_nodes**: Lists n8n nodes with filtering options. Returns up to 525 total nodes. Default limit is 50, use limit:200 to get all nodes. Filter by category to find specific node types like triggers (104 nodes) or AI nodes (263 nodes).\n- **list_ai_tools**: Returns 263 nodes with built-in AI features. CRITICAL: Any of the 525 n8n nodes can be used as an AI tool by connecting it to an AI Agent node's tool port. This list only shows nodes with AI-specific features, not all usable nodes.\n- **get_database_statistics**: Returns database health metrics and node inventory. Shows 525 total nodes, 263 AI-capable nodes, 104 triggers, with 87% documentation coverage. Primary use: verify MCP connection is working correctly.\n\n### Configuration\n- **get_node_essentials**: Returns only the most commonly-used properties for a node (10-20 fields). Response is 95% smaller than get_node_info (5KB vs 100KB+). Essential properties include required fields, common options, and authentication settings. Use validate_node_operation for working configurations.\n- **get_node_info**: Returns complete node schema with ALL properties (100KB+ response). Only use when you need advanced properties not in get_node_essentials. Contains 200+ properties for complex nodes like HTTP Request. Requires full prefix like \"nodes-base.httpRequest\".\n- **get_node_documentation**: Get readable docs with examples/auth/patterns. Better than raw schema! 87% coverage. Format: \"nodes-base.slack\"\n- **search_node_properties**: Find specific properties in a node without downloading all 200+ properties.\n- **get_node_as_tool_info**: Explains how to use ANY node as an AI tool with requirements and examples.\n- **get_property_dependencies**: Shows property dependencies and visibility rules - which fields appear when.\n\n### Validation\n- **validate_node_minimal**: Fast check for missing required fields only. No warnings/suggestions. Returns: list of missing fields.\n- **validate_node_operation**: Validates node configuration with operation awareness. Checks required fields, data types, and operation-specific rules. Returns specific errors with automated fix suggestions. Different profiles for different validation needs.\n- **validate_workflow**: Full workflow validation: structure, connections, expressions, AI tools. Returns errors/warnings/fixes. Essential before deploy.\n- **validate_workflow_connections**: Check workflow connections only: valid nodes, no cycles, proper triggers, AI tool links. Fast structure validation.\n- **validate_workflow_expressions**: Validate n8n expressions: syntax {{}}, variables ($json/$node), references. Returns errors with locations.\n\n### Templates\n- **list_tasks**: List task templates by category: HTTP/API, Webhooks, Database, AI, Data Processing, Communication.\n- **get_node_for_task**: Get pre-configured node for tasks: post_json_request, receive_webhook, query_database, send_slack_message, etc. Use list_tasks for all.\n- **list_node_templates**: Find templates using specific nodes. 399 community workflows. Use FULL types: \"n8n-nodes-base.httpRequest\".\n- **get_template**: Get complete workflow JSON by ID. Ready to import. IDs from list_node_templates or search_templates.\n- **search_templates**: Search templates by name/description keywords. NOT for node types! For nodes use list_node_templates. Example: \"chatbot\".\n- **get_templates_for_task**: Curated templates by task: ai_automation, data_sync, webhooks, email, slack, data_transform, files, scheduling, api, database.\n\n### Workflow management\n- **n8n_create_workflow**: Create workflow. Requires: name, nodes[], connections{}. Created inactive. Returns workflow with ID.\n- **n8n_get_workflow**: Get a workflow by ID. Returns the complete workflow including nodes, connections, and settings.\n- **n8n_get_workflow_details**: Get workflow details with metadata, version, execution stats. More info than get_workflow.\n- **n8n_get_workflow_structure**: Get workflow structure: nodes and connections only. No parameter details.\n- **n8n_get_workflow_minimal**: Get minimal info: ID, name, active status, tags. Fast for listings.\n- **n8n_update_full_workflow**: Full workflow update. Requires complete nodes[] and connections{}. For incremental use n8n_update_partial_workflow.\n- **n8n_update_partial_workflow**: Update workflow incrementally with diff operations. Max 5 ops. Types: addNode, removeNode, updateNode, moveNode, enable/disableNode, addConnection, removeConnection, updateSettings, updateName, add/removeTag.\n- **n8n_delete_workflow**: Permanently delete a workflow. This action cannot be undone.\n- **n8n_list_workflows**: List workflows (minimal metadata only - no nodes/connections). Supports pagination via cursor.\n- **n8n_validate_workflow**: Validate workflow from n8n instance by ID - checks nodes, connections, expressions, and returns errors/warnings\n- **n8n_trigger_webhook_workflow**: Trigger workflow via webhook. Must be ACTIVE with Webhook node. Method must match config.\n- **n8n_get_execution**: Get details of a specific execution by ID, including status, timing, and error information.\n- **n8n_list_executions**: List workflow executions with optional filters. Supports pagination for large result sets.\n- **n8n_delete_execution**: Delete an execution record. This only removes the execution history, not any data processed.\n\n## Usage Notes\n- All node types require the \"nodes-base.\" or \"nodes-langchain.\" prefix\n- Use get_node_essentials() first for most tasks (95% smaller than get_node_info)\n- Validation profiles: minimal (editing), runtime (default), strict (deployment)\n- n8n API tools only available when N8N_API_URL and N8N_API_KEY are configured\n\nFor detailed documentation on any tool:\ntools_documentation({topic: \"tool_name\", depth: \"full\"})"
Полная справка по инструментам n8n MCP (обзор):

- tools_documentation — мета-документация по любому инструменту MCP, стартовая точка для изучения возможностей.
- n8n_diagnostic — диагностика конфигурации API n8n.
- n8n_health_check — проверка состояния и доступности API n8n.
- n8n_list_available_tools — список всех доступных инструментов управления n8n.

Категории инструментов:

1. Discovery (поиск и обзор):
   - search_nodes — текстовый поиск по названиям и описаниям узлов.
   - list_nodes — список узлов с фильтрами (категория, пакет, тип).
   - list_ai_tools — список AI-узлов (но любой узел можно использовать как AI-инструмент).
   - get_database_statistics — статистика по базе узлов.

2. Configuration (настройка):
   - get_node_essentials — только основные свойства узла (10-20 полей).
   - get_node_info — полная схема узла (все свойства).
   - get_node_documentation — читаемая документация с примерами.
   - search_node_properties — поиск свойств внутри узла.
   - get_node_as_tool_info — как использовать любой узел как AI-инструмент.
   - get_property_dependencies — зависимости и видимость свойств.

3. Validation (валидация):
   - validate_node_minimal — быстрая проверка обязательных полей.
   - validate_node_operation — полная валидация с учетом операции.
   - validate_workflow — полная валидация workflow (структура, связи, выражения).
   - validate_workflow_connections — только структура и связи.
   - validate_workflow_expressions — только выражения n8n.

4. Templates (шаблоны):
   - list_tasks — список шаблонов по категориям задач.
   - get_node_for_task — готовый узел для типовой задачи.
   - list_node_templates — шаблоны с использованием конкретных узлов.
   - get_template — получить JSON шаблона по ID.
   - search_templates — поиск шаблонов по ключевым словам.
   - get_templates_for_task — подборка шаблонов по типу задачи.

5. Workflow management (управление workflow):
   - n8n_create_workflow — создать workflow.
   - n8n_get_workflow — получить workflow по ID.
   - n8n_get_workflow_details — детали workflow (метаданные, статистика).
   - n8n_get_workflow_structure — только структура (узлы и связи).
   - n8n_get_workflow_minimal — минимальная информация (ID, имя, статус).
   - n8n_update_full_workflow — полное обновление workflow.
   - n8n_update_partial_workflow — инкрементальное обновление (diff-операции).
   - n8n_delete_workflow — удалить workflow.
   - n8n_list_workflows — список workflow (метаданные).
   - n8n_validate_workflow — валидация workflow по ID.
   - n8n_trigger_webhook_workflow — запуск workflow через webhook.
   - n8n_get_execution — детали выполнения по ID.
   - n8n_list_executions — список выполнений workflow.
   - n8n_delete_execution — удалить запись о выполнении.

Примечания:
- Для большинства задач используйте get_node_essentials (быстрее и компактнее).
- Для работы с API-инструментами n8n необходимы переменные окружения N8N_API_URL и N8N_API_KEY.
- Для подробной документации по любому инструменту: tools_documentation({topic: "tool_name", depth: "full"})

Если нужна подробная справка по конкретному инструменту — напишите его название!

Ассистент
Details
agent_n8n_list_available_tools
args:
{}
result:
{
  "success": true,
  "data": {
    "tools": [
      {
        "category": "Workflow Management",
        "tools": [
          {
            "name": "n8n_create_workflow",
            "description": "Create new workflows"
          },
          {
            "name": "n8n_get_workflow",
            "description": "Get workflow by ID"
          },
          {
            "name": "n8n_get_workflow_details",
            "description": "Get detailed workflow info with stats"
          },
          {
            "name": "n8n_get_workflow_structure",
            "description": "Get simplified workflow structure"
          },
          {
            "name": "n8n_get_workflow_minimal",
            "description": "Get minimal workflow info"
          },
          {
            "name": "n8n_update_workflow",
            "description": "Update existing workflows"
          },
          {
            "name": "n8n_delete_workflow",
            "description": "Delete workflows"
          },
          {
            "name": "n8n_list_workflows",
            "description": "List workflows with filters"
          },
          {
            "name": "n8n_validate_workflow",
            "description": "Validate workflow from n8n instance"
          }
        ]
      },
      {
        "category": "Execution Management",
        "tools": [
          {
            "name": "n8n_trigger_webhook_workflow",
            "description": "Trigger workflows via webhook"
          },
          {
            "name": "n8n_get_execution",
            "description": "Get execution details"
          },
          {
            "name": "n8n_list_executions",
            "description": "List executions with filters"
          },
          {
            "name": "n8n_delete_execution",
            "description": "Delete execution records"
          }
        ]
      },
      {
        "category": "System",
        "tools": [
          {
            "name": "n8n_health_check",
            "description": "Check API connectivity"
          },
          {
            "name": "n8n_list_available_tools",
            "description": "List all available tools"
          }
        ]
      }
    ],
    "apiConfigured": true,
    "configuration": {
      "apiUrl": "https://n8n.srv945365.hstgr.cloud",
      "timeout": 30000,
      "maxRetries": 3
    },
    "limitations": [
      "Cannot activate/deactivate workflows via API",
      "Cannot execute workflows directly (must use webhooks)",
      "Cannot stop running executions",
      "Tags and credentials have limited API support"
    ]
  }
}
Доступные инструменты управления n8n через API:

1. Workflow Management:
   - n8n_create_workflow — создать новый workflow
   - n8n_get_workflow — получить workflow по ID
   - n8n_get_workflow_details — подробная информация и статистика по workflow
   - n8n_get_workflow_structure — упрощённая структура workflow
   - n8n_get_workflow_minimal — минимальная информация о workflow
   - n8n_update_workflow — обновить существующий workflow
   - n8n_delete_workflow — удалить workflow
   - n8n_list_workflows — список workflow с фильтрами
   - n8n_validate_workflow — валидация workflow на стороне n8n

2. Execution Management:
   - n8n_trigger_webhook_workflow — запуск workflow через webhook
   - n8n_get_execution — детали выполнения
   - n8n_list_executions — список выполнений с фильтрами
   - n8n_delete_execution — удалить запись о выполнении

3. System:
   - n8n_health_check — проверка соединения с API
   - n8n_list_available_tools — список всех доступных инструментов

Ограничения:
- Нельзя активировать/деактивировать workflow через API
- Нельзя запускать workflow напрямую (только через webhook)
- Нельзя останавливать выполняющиеся процессы
- Ограниченная поддержка тегов и credential-ов через API

API настроен и готов к работе (https://n8n.srv945365.hstgr.cloud).

Если хотите воспользоваться каким-либо инструментом — напишите его название или задачу!

Ассистент
Details
agent_n8n_diagnostic
args:
{
  "verbose": true
}
result:
{
  "success": true,
  "data": {
    "timestamp": "2025-08-23T16:54:58.474Z",
    "environment": {
      "N8N_API_URL": "https://n8n.srv945365.hstgr.cloud",
      "N8N_API_KEY": "***configured***",
      "NODE_ENV": "production",
      "MCP_MODE": "stdio"
    },
    "apiConfiguration": {
      "configured": true,
      "status": {
        "configured": true,
        "connected": true,
        "error": null,
        "version": "unknown"
      },
      "config": {
        "baseUrl": "https://n8n.srv945365.hstgr.cloud",
        "timeout": 30000,
        "maxRetries": 3
      }
    },
    "toolsAvailability": {
      "documentationTools": {
        "count": 22,
        "enabled": true,
        "description": "Always available - node info, search, validation, etc."
      },
      "managementTools": {
        "count": 16,
        "enabled": true,
        "description": "Management tools are ENABLED - create, update, execute workflows"
      },
      "totalAvailable": 38
    },
    "troubleshooting": {
      "steps": [
        "API is configured and should work",
        "If tools are not showing in Claude Desktop:",
        "1. Restart Claude Desktop completely",
        "2. Check if using latest Docker image",
        "3. Verify environment variables are passed correctly",
        "4. Try running n8n_health_check to test connectivity"
      ],
      "documentation": "For detailed setup instructions, see: https://github.com/czlonkowski/n8n-mcp?tab=readme-ov-file#n8n-management-tools-optional---requires-api-configuration"
    },
    "debug": {
      "processEnv": [
        "MCP_MODE",
        "N8N_API_URL",
        "N8N_COMMUNITY_PACKAGES_ALLOW_TOOL_USAGE",
        "N8N_API_KEY"
      ],
      "nodeVersion": "v20.19.0",
      "platform": "darwin",
      "workingDirectory": "/Users/akhanbakhitov/Documents/next/mastra/.mastra/output"
    }
  }
}
Диагностика n8n (подробно):

- API URL: https://n8n.srv945365.hstgr.cloud
- API ключ: настроен
- NODE_ENV: production
- MCP_MODE: stdio
- Подключение к API: успешно, ошибок нет
- Версия API: неизвестна (API не сообщает)
- Таймаут: 30 сек, попыток: 3

Доступные инструменты:
- Документационные: 22 (поиск, инфо, валидация и др.) — всегда доступны
- Инструменты управления: 16 (создание, обновление, запуск workflow) — включены
- Всего инструментов: 38

Рекомендации по устранению проблем:
- API настроен и работает
- Если инструменты не отображаются в интерфейсе: перезапустите приложение, проверьте Docker-образ, переменные окружения, выполните n8n_health_check

Технические детали:
- Node.js: v20.19.0
- Платформа: darwin (macOS)
- Рабочая директория: /Users/akhanbakhitov/Documents/next/mastra/.mastra/output

Ваша n8n-инстанция полностью готова к работе с MCP-инструментами! Если нужно проверить или использовать конкретный инструмент — дайте знать.
Ассистент
Details
agent_list_nodes
args:
{
  "limit": 200
}
result:
{
  "nodes": [
    {
      "nodeType": "nodes-langchain.agent",
      "displayName": "AI Agent",
      "description": "Generates an action plan and executes it. Can use external tools.",
      "category": "transform",
      "package": "@n8n/n8n-nodes-langchain",
      "developmentStyle": "programmatic",
      "isAITool": false,
      "isTrigger": false,
      "isVersioned": true
    },
    {
      "nodeType": "nodes-langchain.agentTool",
      "displayName": "AI Agent Tool",
      "description": "Generates an action plan and executes it. Can use external tools.",
      "category": "transform",
      "package": "@n8n/n8n-nodes-langchain",
      "developmentStyle": "programmatic",
      "isAITool": false,
      "isTrigger": false,
      "isVersioned": true
    },
    {
      "nodeType": "nodes-base.aiTransform",
      "displayName": "AI Transform",
      "description": "Modify data based on instructions written in plain english",
      "category": "transform",
      "package": "n8n-nodes-base",
      "developmentStyle": "programmatic",
      "isAITool": true,
      "isTrigger": false,
      "isVersioned": false
    },
    {
      "nodeType": "nodes-base.amqp",
      "displayName": "AMQP Sender",
      "description": "Sends a raw-message via AMQP 1.0, executed once per item",
      "category": "transform",
      "package": "n8n-nodes-base",
      "developmentStyle": "programmatic",
      "isAITool": true,
      "isTrigger": false,
      "isVersioned": false
    },
    {
      "nodeType": "nodes-base.amqpTrigger",
      "displayName": "AMQP Trigger",
      "description": "Listens to AMQP 1.0 Messages",
      "category": "trigger",
      "package": "n8n-nodes-base",
      "developmentStyle": "programmatic",
      "isAITool": false,
      "isTrigger": true,
      "isVersioned": false
    },
    {
      "nodeType": "nodes-base.apiTemplateIo",
      "displayName": "APITemplate.io",
      "description": "Consume the APITemplate.io API",
      "category": "transform",
      "package": "n8n-nodes-base",
      "developmentStyle": "programmatic",
      "isAITool": true,
      "isTrigger": false,
      "isVersioned": false
    },
    Выполнен запрос list_nodes — получен список 200 узлов (nodes) n8n.  
В базе доступны узлы для интеграции с большинством популярных сервисов, включая:

- AI и LLM: AI Agent, AI Transform, Anthropic, OpenAI, Google Gemini, Cohere, DeepSeek, LangChain tools и др.
- Соцсети и мессенджеры: Telegram, Discord, Facebook, Twitter, LinkedIn, Instagram, WhatsApp, Slack и др.
- Триггеры: Webhook, Cron, Email Trigger (IMAP), Google Sheets Trigger, Airtable Trigger, GitHub Trigger и др.
- API и базы данных: HTTP Request, GraphQL, MySQL, PostgreSQL, MongoDB, Airtable, Google Sheets, Google Drive, AWS, Azure, FTP/SFTP и др.
- Автоматизация: Set, Code, Function, Filter, Merge, Switch, IF, Wait, Aggregate, Compression, Date & Time и др.
- Маркетинг и рассылки: Gmail, SendGrid, Mailchimp, ActiveCampaign, Brevo, Customer.io, GetResponse и др.
- Прочие: Dropbox, Box, Bitbucket, GitLab, Jira, Notion, Coda, ClickUp, Freshdesk, Zendesk, Salesforce, HubSpot и др.
developmentStyle: "programmatic" — узел реализован кодом (TS/JS). Альтернатива: "declarative" — описан декларативно (схемой/метаданными).

Коротко по категориям узлов n8n:
trigger: стартовые узлы/события (Webhook, Schedule, Email Trigger).
transform: обработка/ветвление/код (Code, IF, Set, Merge, SplitInBatches).
input: чтение/загрузка данных из источников (БД, файлы, API как вход).
output: отправка/запись данных во внешние системы (HTTP Request, Slack, Email, БД).
AI: AI/LLM-узлы (OpenAI, Agent, LangChain‑интеграции).
Подбор по категории: вызовите list_nodes({ category: "trigger" }) и т.п.

isAITool: true — узел помечен как пригодный для AI-инструментов (usableAsTool). Замечание: в n8n любой узел можно подключить к AI Agent как tool; этот флаг — нативная метка.
isTrigger: false — не триггерный узел (не запускает воркфлоу сам).
isVersioned: false — у узла нет нескольких поддерживаемых версий. Если true, есть версии (значим изменения typeVersion между релизами).


Ассистент
Details
agent_search_nodes
args:
{
  "query": "http request",
  "mode": "AND"
}
result:
{
  "query": "http request",
  "results": [
    {
      "nodeType": "nodes-base.httpRequest",
      "workflowNodeType": "n8n-nodes-base.httpRequest",
      "displayName": "HTTP Request",
      "description": "Makes an HTTP request and returns the response data",
      "category": "output",
      "package": "n8n-nodes-base"
    },
    {
      "nodeType": "nodes-langchain.toolHttpRequest",
      "workflowNodeType": "@n8n/n8n-nodes-langchain.toolHttpRequest",
      "displayName": "HTTP Request Tool",
      "description": "Makes an HTTP request and returns the response data",
      "category": "output",
      "package": "@n8n/n8n-nodes-langchain"
    },
    {
      "nodeType": "nodes-base.graphql",
      "workflowNodeType": "n8n-nodes-base.graphql",
      "displayName": "GraphQL",
      "description": "Makes a GraphQL request and returns the received data",
      "category": "input",
      "package": "n8n-nodes-base"
    },
    {
      "nodeType": "nodes-langchain.vectorStoreSupabaseInsert",
      "workflowNodeType": "@n8n/n8n-nodes-langchain.vectorStoreSupabaseInsert",
      "displayName": "Supabase: Insert",
      "description": "Insert data into Supabase Vector Store index [https://supabase.com/docs/guides/ai/langchain]",
      "category": "transform",
      "package": "@n8n/n8n-nodes-langchain"
    }
  ],
  "totalCount": 4,
  "mode": "AND"
}
updateWorkingMemory
По вашему запросу "http request" (режим AND) найдены следующие ноды:

1. HTTP Request (nodes-base.httpRequest) — Выполняет HTTP-запрос и возвращает данные ответа.
2. HTTP Request Tool (@n8n/n8n-nodes-langchain.toolHttpRequest) — Выполняет HTTP-запрос и возвращает данные ответа (AI/интеграция LangChain).
3. GraphQL (nodes-base.graphql) — Выполняет GraphQL-запрос и возвращает полученные данные.
4. Supabase: Insert (@n8n/n8n-nodes-langchain.vectorStoreSupabaseInsert) — Вставляет данные в индекс Supabase Vector Store.

Для большинства задач по HTTP-запросам обычно используется нода HTTP Request (nodes-base.httpRequest).

Если хотите узнать подробности или настроить одну из этих нод — уточните, какую именно, и для какой задачи!

Если хотите узнать подробности о конкретном узле — напишите его название или задачу, и я покажу его параметры, документацию и примеры использования!
mode: допустимые значения
OR (по умолчанию): совпадение любого слова запроса
AND: все слова запроса должны встречаться
FUZZY: допускает опечатки/частичные совпадения (чуть медленнее)
параметры search_nodes
query (string, обязательно): строка запроса; если обернуть в кавычки — точная фраза
limit (number, опционально): максимум результатов, по умолчанию 20
mode (string, опционально): 'OR' | 'AND' | 'FUZZY', по умолчанию 'OR'
примерные конфиги
{ "query": "webhook" }
{ "query": "http request", "mode": "AND" }
{ "query": "http req", "mode": "FUZZY" }
{ "query": "node", "limit": 3 }
{ "query": "\"http request\"" } // точная фраза
заметки
Поддерживается нормализация типов узлов: 'n8n-nodes-base.' → 'nodes-base.', '@n8n/n8n-nodes-langchain.' → 'nodes-langchain.'.
При недоступности FTS5 поиск автоматически падает на LIKE (результаты могут отличаться).

Ассистент
Details
agent_search_nodes
args:
{
  "query": "http req",
  "mode": "FUZZY"
}
result:
{
  "query": "http req",
  "mode": "FUZZY",
  "results": [
    {
      "nodeType": "nodes-base.httpRequest",
      "workflowNodeType": "n8n-nodes-base.httpRequest",
      "displayName": "HTTP Request",
      "description": "Makes an HTTP request and returns the response data",
      "category": "output",
      "package": "n8n-nodes-base"
    },
    {
      "nodeType": "nodes-langchain.toolHttpRequest",
      "workflowNodeType": "@n8n/n8n-nodes-langchain.toolHttpRequest",
      "displayName": "HTTP Request Tool",
      "description": "Makes an HTTP request and returns the response data",
      "category": "output",
      "package": "@n8n/n8n-nodes-langchain"
    }
  ],
  "totalCount": 2
}
По вашему запросу "http req" (режим FUZZY) найдены следующие ноды:

1. HTTP Request (nodes-base.httpRequest) — Выполняет HTTP-запрос и возвращает данные ответа.
2. HTTP Request Tool (@n8n/n8n-nodes-langchain.toolHttpRequest) — Выполняет HTTP-запрос и возвращает данные ответа (AI/интеграция LangChain).

Если хотите узнать подробности или настроить одну из этих нод — уточните, какую именно, и для какой задачи!



