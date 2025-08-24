## n8n‑MCP: Полное функциональное описание (RU)

### Назначение

n8n‑MCP — это сервер по протоколу Model Context Protocol (MCP), предоставляющий ИИ‑ассистентам (Claude, Cursor и др.) структурированный доступ к узлам n8n: документации, свойствам, операциям, шаблонам и проверкам конфигураций. При подключении к API n8n добавляются инструменты управления воркфлоу (создание/чтение/обновление/выполнение/валидирование).

### Режимы запуска и интерфейсы

- Стандартный stdio (локально для Claude Desktop): двунаправленный поток stdin/stdout. Команда: `node dist/mcp/index.js` (или `npx n8n-mcp`).
- HTTP Fixed (по умолчанию в Docker Compose): единый постоянный экземпляр MCP‑сервера, ручная обработка JSON‑RPC без Streamable транспорта.
- HTTP Single‑Session (SDK‑паттерн): `StreamableHTTPServerTransport` + поддержка SSE; мультисессии, TTL, уборка.

HTTP эндпоинты (фактические):
- GET `/` — информация об API и версия.
- GET `/health` — состояние, аптайм, память, версия.
- GET `/mcp` — информация об MCP; в Single‑Session также SSE‑инициализация при `Accept: text/event-stream`.
- POST `/mcp` — JSON‑RPC (методы MCP). Требуется `Authorization: Bearer <AUTH_TOKEN>`.
- DELETE `/mcp` — завершение сессии (Single‑Session) при заголовке `Mcp-Session-Id`.

Аутентификация в HTTP‑режиме:
- Переменные: `AUTH_TOKEN` или `AUTH_TOKEN_FILE` (путь к файлу с токеном).
- Токен обязателен и триммируется; короткие/дефолтные значения помечаются предупреждениями, в production — блокируются.

Ключевые переменные окружения:
- `MCP_MODE=stdio|http` (по умолчанию http в Docker Compose).
- `USE_FIXED_HTTP=true|false` — включить Fixed HTTP реализацию.
- `NODE_DB_PATH` — путь к `nodes.db` (по умолчанию `/app/data/nodes.db` в контейнере).
- `N8N_API_URL`, `N8N_API_KEY` — включают инструменты управления n8n.
- Прочие: `PORT`, `HOST`, `LOG_LEVEL`, `TRUST_PROXY`, `BASE_URL`/`PUBLIC_URL`.

### Мультисессии (Single‑Session HTTP)

- При `initialize` создаётся пара «транспорт+сервер», сессия идентифицируется `Mcp-Session-Id` (UUID v4), который клиент обязан передавать в заголовке в последующих запросах.
- Лимиты: максимум 100 активных сессий; таймаут простоя 30 минут; фоновая уборка каждые 5 минут; `DELETE /mcp` завершает сессию вручную.
- SSE: `GET /mcp` с `Accept: text/event-stream` создаёт/пересоздаёт SSE‑сессию.

### Структура БД и поведение запросов

Адаптеры БД:
- Предпочтительно `better-sqlite3` (нативный модуль). При несовместимости версий Node — автоматический fallback на `sql.js` (WASM) с периодическим сохранением файла.

Таблицы:
- `nodes` — основная таблица данных об узлах:
  - `node_type` (PK), `package_name`, `display_name`, `description`, `category`, `development_style ('declarative'|'programmatic')`,
  - флаги: `is_ai_tool`, `is_trigger`, `is_webhook`, `is_versioned`,
  - `version`, `documentation` (сырой markdown/текст),
  - `properties_schema` (JSON), `operations` (JSON), `credentials_required` (JSON),
  - при оптимизированной схеме также: `node_source_code`, `credential_source_code`, `source_location`, `source_extracted_at`.
- Индексы: по `package_name`, `is_ai_tool`, `category`.
- FTS5 (если поддерживается): `nodes_fts` + триггеры на insert/update/delete. Иначе — fallback на LIKE‑поиск.
- `templates` — библиотека шаблонов воркфлоу: `id`, `workflow_id`, `name`, `description`, `author_*`, `nodes_used` (JSON), `workflow_json`, `categories` (JSON), `views`, `created_at/updated_at`, `url`, `scraped_at`.

Типичные SQL‑запросы внутри сервера (автоматически формируются репозиторием):
- Поиск: либо FTS5 `MATCH` с ранжированием и пост‑скорингом, либо `LIKE` по `node_type/display_name/description`.
- Детали узла: `SELECT * FROM nodes WHERE node_type = ?` с безопасной JSON‑десериализацией.
- Списки: фильтры по пакету, категории, стилю разработки, флагам.

Поведение при выполнении:
- Если включён FTS5 — быстрый полнотекстовый поиск с дополнительным ранжированием (выделяются «первичные» узлы вроде `webhook`/`httpRequest`).
- При больших ответах инструменты могут возвращать урезанный текст (>1MB — обрезка и сброс structuredContent для MCP совместимости).

### MCP инструменты (полный перечень)

Категория: Справка/Обзор
- `tools_documentation(topic?: string, depth?: 'essentials'|'full')` — обзор всех инструментов или детальная документация по одному.

Категория: Обнаружение/Документация узлов
- `list_nodes({ package?, category?, developmentStyle?, isAITool?, limit? })` — список узлов с фильтрами.
- `search_nodes({ query, limit?, mode? })` — поиск по узлам (OR/AND/FUZZY).
- `get_database_statistics()` — статистика БД (кол-во узлов, пакетов, покрытие документации и т.п.).
- `get_node_info({ nodeType })` — полная информация по узлу (в т.ч. `workflowNodeType`, outputs, AI‑capabilities).
- `get_node_documentation({ nodeType })` — нормализованные доки (если отсутствуют — генерируется тонкий fallback из essentials).
- `get_node_essentials({ nodeType })` — только «существенные» поля (required/common), список операций.
- `search_node_properties({ nodeType, query, maxResults? })` — поиск свойств внутри узла с путями.
- `get_node_as_tool_info({ nodeType })` — как использовать ЛЮБОЙ узел как AI‑tool, требования и примеры.

Категория: Шаблоны
- `list_node_templates({ nodeTypes, limit? })` — найти шаблоны по наборам узлов.
- `get_template({ templateId })` — получить полный JSON воркфлоу по ID.
- `search_templates({ query, limit? })` — поиск по имени/описанию шаблонов.
- `get_templates_for_task({ task })` — curated‑подборка по типам задач (ai_automation, data_sync и др.).
- `get_node_for_task({ task })` — заранее сконфигурированный узел под типовую задачу (HTTP, Slack, Webhook, DB и т.д.).
- `list_tasks({ category? })` — список доступных задач (категории: HTTP/API, Webhooks, Database, AI и др.).

Категория: Валидация
- `validate_node_minimal({ nodeType, config })` — проверка только обязательных полей.
- `validate_node_operation({ nodeType, config, profile? })` — валидатор, учитывающий операции/ресурсы и профили (`minimal|runtime|ai-friendly|strict`).
- `get_property_dependencies({ nodeType, config? })` — анализ зависимостей и видимости полей.
- `validate_workflow({ workflow, options? })` — полная проверка воркфлоу (узлы/связи/выражения) с агрегированной сводкой.
- `validate_workflow_connections({ workflow })` — проверка только связей/триггеров/циклов.
- `validate_workflow_expressions({ workflow })` — проверка выражений (`{{ }}`, `$json`, `$node["..."]`, и т.п.).

Категория: Управление n8n (требует `N8N_API_URL` + `N8N_API_KEY`)
- Воркфлоу:
  - `n8n_create_workflow({ name, nodes[], connections{}, settings? })`
  - `n8n_get_workflow({ id })`, `n8n_get_workflow_details({ id })`, `n8n_get_workflow_structure({ id })`, `n8n_get_workflow_minimal({ id })`
  - `n8n_update_full_workflow({ id, name?, nodes?, connections?, settings? })`
  - `n8n_update_partial_workflow({ id, operations[], validateOnly? })` — инкрементальные дифф‑операции (до 5 за раз): `addNode/removeNode/updateNode/moveNode/(en|dis)ableNode/addConnection/removeConnection/updateSettings/updateName/addTag/removeTag`.
  - `n8n_delete_workflow({ id })`
  - `n8n_list_workflows({ limit?, cursor?, active?, tags?, projectId?, excludePinnedData? })`
  - `n8n_validate_workflow({ id, options? })` — валидирует воркфлоу, полученный из n8n API.
- Выполнения:
  - `n8n_trigger_webhook_workflow({ webhookUrl, httpMethod?, data?, headers?, waitForResponse? })`
  - `n8n_get_execution({ id, includeData? })`, `n8n_list_executions({ limit?, cursor?, workflowId?, projectId?, status?, includeData? })`, `n8n_delete_execution({ id })`
- Система:
  - `n8n_health_check()` — доступность n8n/API и поддерживаемые возможности.
  - `n8n_list_available_tools()` — какие инструменты управления доступны при текущей конфигурации.
  - `n8n_diagnostic({ verbose? })` — диагностика конфигурации/доступности API/переменных окружения.

### Запросы/ответы: что отправлять и чего ожидать

Формат MCP JSON‑RPC по HTTP (Fixed):
- Заголовки: `Content-Type: application/json`, `Authorization: Bearer <AUTH_TOKEN>`.
- Метод JSON‑RPC и параметры в теле.

Пример: инициализация
```json
{ "jsonrpc": "2.0", "id": 1, "method": "initialize", "params": { "protocolVersion": "2025-03-26", "capabilities": {"tools": {}}, "clientInfo": {"name": "your-client", "version": "x.y.z"} } }
```

Пример: список инструментов
```json
{ "jsonrpc": "2.0", "id": 2, "method": "tools/list" }
```

Пример: вызов инструмента `get_node_essentials`
```json
{ "jsonrpc": "2.0", "id": 3, "method": "tools/call", "params": { "name": "get_node_essentials", "arguments": { "nodeType": "nodes-base.httpRequest" } } }
```

Ответ MCP:
- Всегда содержит `result.content[0].text` (строка), иногда `structuredContent` для валидационных инструментов (соответствует `outputSchema`).
- Большие ответы могут быть усечены до ~1MB с пометкой о тримминге.
- Ошибки — в виде `error.code` и `error.message`; в ответах‑ошибках для call сервер дополняет текст подсказками (частые проблемы: отсутствие обязательных полей, типовые несоответствия, неизвестные категории/ресурсы).

Ожидаемая семантика ответов по ключевым инструментам:
- `get_node_essentials` — `requiredProperties[]`, `commonProperties[]`, `operations[]`, `metadata` (флаги isAI/isTrigger/isWebhook, наличие cred, пакет, стиль).
- `validate_node_operation` — `valid`, `errors[]`, `warnings[]`, `suggestions[]`, `summary` (счётчики).
- `validate_workflow` — `valid`, `summary` (узлы/триггеры/связи/выражения/счётчики), опционально списки `errors[]/warnings[]/suggestions[]`.
- `list_nodes/search_nodes` — коллекции с `nodeType`, `workflowNodeType`, `displayName`, `description`, `category`, `package` и т.п.

### Особенности обработки и совместимость

- Нормализация типов узлов: сервер принимает `nodes-base.*`, `n8n-nodes-base.*`, `@n8n/n8n-nodes-langchain.*` — выполняется приведение к внутреннему формату, а также поиск «альтернатив» для edge‑кейсов/регистровых расхождений.
- Ответы для н8n‑клиентов могут быть преобразованы в «n8n‑friendly» описания.
- Валидация входов инструментов: строгая, с понятными сообщениями об ошибках; часть инструментов допускает дополнительные свойства (совместимость с клиентами), но полевая схема проверяется.

### Примеры curl

Инициализация (Fixed HTTP):
```bash
curl -sS -X POST "$BASE_URL/mcp" \
  -H "Authorization: Bearer $AUTH_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2025-03-26","capabilities":{"tools":{}},"clientInfo":{"name":"curl","version":"0"}}}'
```

Вызов `search_nodes`:
```bash
curl -sS -X POST "$BASE_URL/mcp" \
  -H "Authorization: Bearer $AUTH_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":2,"method":"tools/call","params":{"name":"search_nodes","arguments":{"query":"webhook","limit":10}}}'
```

Вызов `validate_node_operation`:
```bash
curl -sS -X POST "$BASE_URL/mcp" \
  -H "Authorization: Bearer $AUTH_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":3,"method":"tools/call","params":{"name":"validate_node_operation","arguments":{"nodeType":"nodes-base.httpRequest","config":{"method":"GET","url":"https://example.com"},"profile":"runtime"}}}'
```

### Рекомендации по использованию

1) Всегда начинайте с discovery:
- `search_nodes` → `get_node_essentials` → (при необходимости) `get_node_info`.
2) Перед сборкой проверяйте конфигурации узлов:
- `validate_node_minimal`/`validate_node_operation`.
3) Соберите воркфлоу, затем выполните итоговую проверку:
- `validate_workflow` (+ при необходимости `validate_workflow_connections`/`validate_workflow_expressions`).
4) При наличии n8n API — создавайте/обновляйте воркфлоу через `n8n_*` инструменты. Для больших/частых правок — `n8n_update_partial_workflow` (экономит токены).

### Диагностика

- Проверка живости сервера: `GET /health`.
- Проверка доступности инструментов управления: `n8n_list_available_tools` и `n8n_diagnostic`.
- При HTTP — тщательно проверяйте `Authorization: Bearer` и содержимое тела JSON‑RPC. В логах сервера есть подробные сообщения о причинах отказа (без утечки чувствительных данных на проде).

### Ограничения и примечания

- Ограничение размера ответа ~1MB (для избежания проблем на клиентах). Большие ответы сокращаются.
- В окружениях без FTS5 поиск падает на LIKE; для задач со сложными запросами используйте точные фразы в кавычках или режим AND.
- Для community‑узлов как AI‑tools может потребоваться `N8N_COMMUNITY_PACKAGES_ALLOW_TOOL_USAGE=true` на стороне n8n.

### Ссылки и запуск

- Быстрый старт: `npx n8n-mcp` (stdio) или Docker‑образ `ghcr.io/czlonkowski/n8n-mcp:latest` (HTTP). В Docker Compose `AUTH_TOKEN` обязателен.
- Для удалённого HTTP‑доступа и Claude Desktop используйте `MCP_MODE=http` и прокиньте токен. В конфиге Claude указывайте команду запуска или docker run c `-i`.


## n8n‑MCP: Полное функциональное описание (RU)

### Назначение

n8n‑MCP — это сервер по протоколу Model Context Protocol (MCP), предоставляющий ИИ‑ассистентам (Claude, Cursor и др.) структурированный доступ к узлам n8n: документации, свойствам, операциям, шаблонам и проверкам конфигураций. При подключении к API n8n добавляются инструменты управления воркфлоу (создание/чтение/обновление/выполнение/валидирование).

### Режимы запуска и интерфейсы

- Стандартный stdio (локально для Claude Desktop): двунаправленный поток stdin/stdout. Команда: `node dist/mcp/index.js` (или `npx n8n-mcp`).
- HTTP Fixed (по умолчанию в Docker Compose): единый постоянный экземпляр MCP‑сервера, ручная обработка JSON‑RPC без Streamable транспорта.
- HTTP Single‑Session (SDK‑паттерн): `StreamableHTTPServerTransport` + поддержка SSE; мультисессии, TTL, уборка.

HTTP эндпоинты (фактические):
- GET `/` — информация об API и версия.
- GET `/health` — состояние, аптайм, память, версия.
- GET `/mcp` — информация об MCP; в Single‑Session также SSE‑инициализация при `Accept: text/event-stream`.
- POST `/mcp` — JSON‑RPC (методы MCP). Требуется `Authorization: Bearer <AUTH_TOKEN>`.
- DELETE `/mcp` — завершение сессии (Single‑Session) при заголовке `Mcp-Session-Id`.

Аутентификация в HTTP‑режиме:
- Переменные: `AUTH_TOKEN` или `AUTH_TOKEN_FILE` (путь к файлу с токеном).
- Токен обязателен и триммируется; короткие/дефолтные значения помечаются предупреждениями, в production — блокируются.

Ключевые переменные окружения:
- `MCP_MODE=stdio|http` (по умолчанию http в Docker Compose).
- `USE_FIXED_HTTP=true|false` — включить Fixed HTTP реализацию.
- `NODE_DB_PATH` — путь к `nodes.db` (по умолчанию `/app/data/nodes.db` в контейнере).
- `N8N_API_URL`, `N8N_API_KEY` — включают инструменты управления n8n.
- Прочие: `PORT`, `HOST`, `LOG_LEVEL`, `TRUST_PROXY`, `BASE_URL`/`PUBLIC_URL`.

### Мультисессии (Single‑Session HTTP)

- При `initialize` создаётся пара «транспорт+сервер», сессия идентифицируется `Mcp-Session-Id` (UUID v4), который клиент обязан передавать в заголовке в последующих запросах.
- Лимиты: максимум 100 активных сессий; таймаут простоя 30 минут; фоновая уборка каждые 5 минут; `DELETE /mcp` завершает сессию вручную.
- SSE: `GET /mcp` с `Accept: text/event-stream` создаёт/пересоздаёт SSE‑сессию.

### Структура БД и поведение запросов

Адаптеры БД:
- Предпочтительно `better-sqlite3` (нативный модуль). При несовместимости версий Node — автоматический fallback на `sql.js` (WASM) с периодическим сохранением файла.

Таблицы:
- `nodes` — основная таблица данных об узлах:
  - `node_type` (PK), `package_name`, `display_name`, `description`, `category`, `development_style ('declarative'|'programmatic')`,
  - флаги: `is_ai_tool`, `is_trigger`, `is_webhook`, `is_versioned`,
  - `version`, `documentation` (сырой markdown/текст),
  - `properties_schema` (JSON), `operations` (JSON), `credentials_required` (JSON),
  - при оптимизированной схеме также: `node_source_code`, `credential_source_code`, `source_location`, `source_extracted_at`.
- Индексы: по `package_name`, `is_ai_tool`, `category`.
- FTS5 (если поддерживается): `nodes_fts` + триггеры на insert/update/delete. Иначе — fallback на LIKE‑поиск.
- `templates` — библиотека шаблонов воркфлоу: `id`, `workflow_id`, `name`, `description`, `author_*`, `nodes_used` (JSON), `workflow_json`, `categories` (JSON), `views`, `created_at/updated_at`, `url`, `scraped_at`.

Типичные SQL‑запросы внутри сервера (автоматически формируются репозиторием):
- Поиск: либо FTS5 `MATCH` с ранжированием и пост‑скорингом, либо `LIKE` по `node_type/display_name/description`.
- Детали узла: `SELECT * FROM nodes WHERE node_type = ?` с безопасной JSON‑десериализацией.
- Списки: фильтры по пакету, категории, стилю разработки, флагам.

Поведение при выполнении:
- Если включён FTS5 — быстрый полнотекстовый поиск с дополнительным ранжированием (выделяются «первичные» узлы вроде `webhook`/`httpRequest`).
- При больших ответах инструменты могут возвращать урезанный текст (>1MB — обрезка и сброс structuredContent для MCP совместимости).

### MCP инструменты (полный перечень)

Категория: Справка/Обзор
- `tools_documentation(topic?: string, depth?: 'essentials'|'full')` — обзор всех инструментов или детальная документация по одному.

Категория: Обнаружение/Документация узлов
- `list_nodes({ package?, category?, developmentStyle?, isAITool?, limit? })` — список узлов с фильтрами.
- `search_nodes({ query, limit?, mode? })` — поиск по узлам (OR/AND/FUZZY).
- `get_database_statistics()` — статистика БД (кол-во узлов, пакетов, покрытие документации и т.п.).
- `get_node_info({ nodeType })` — полная информация по узлу (в т.ч. `workflowNodeType`, outputs, AI‑capabilities).
- `get_node_documentation({ nodeType })` — нормализованные доки (если отсутствуют — генерируется тонкий fallback из essentials).
- `get_node_essentials({ nodeType })` — только «существенные» поля (required/common), список операций.
- `search_node_properties({ nodeType, query, maxResults? })` — поиск свойств внутри узла с путями.
- `get_node_as_tool_info({ nodeType })` — как использовать ЛЮБОЙ узел как AI‑tool, требования и примеры.

Категория: Шаблоны
- `list_node_templates({ nodeTypes, limit? })` — найти шаблоны по наборам узлов.
- `get_template({ templateId })` — получить полный JSON воркфлоу по ID.
- `search_templates({ query, limit? })` — поиск по имени/описанию шаблонов.
- `get_templates_for_task({ task })` — curated‑подборка по типам задач (ai_automation, data_sync и др.).
- `get_node_for_task({ task })` — заранее сконфигурированный узел под типовую задачу (HTTP, Slack, Webhook, DB и т.д.).
- `list_tasks({ category? })` — список доступных задач (категории: HTTP/API, Webhooks, Database, AI и др.).

Категория: Валидация
- `validate_node_minimal({ nodeType, config })` — проверка только обязательных полей.
- `validate_node_operation({ nodeType, config, profile? })` — валидатор, учитывающий операции/ресурсы и профили (`minimal|runtime|ai-friendly|strict`).
- `get_property_dependencies({ nodeType, config? })` — анализ зависимостей и видимости полей.
- `validate_workflow({ workflow, options? })` — полная проверка воркфлоу (узлы/связи/выражения) с агрегированной сводкой.
- `validate_workflow_connections({ workflow })` — проверка только связей/триггеров/циклов.
- `validate_workflow_expressions({ workflow })` — проверка выражений (`{{ }}`, `$json`, `$node["..."]`, и т.п.).

Категория: Управление n8n (требует `N8N_API_URL` + `N8N_API_KEY`)
- Воркфлоу:
  - `n8n_create_workflow({ name, nodes[], connections{}, settings? })`
  - `n8n_get_workflow({ id })`, `n8n_get_workflow_details({ id })`, `n8n_get_workflow_structure({ id })`, `n8n_get_workflow_minimal({ id })`
  - `n8n_update_full_workflow({ id, name?, nodes?, connections?, settings? })`
  - `n8n_update_partial_workflow({ id, operations[], validateOnly? })` — инкрементальные дифф‑операции (до 5 за раз): `addNode/removeNode/updateNode/moveNode/(en|dis)ableNode/addConnection/removeConnection/updateSettings/updateName/addTag/removeTag`.
  - `n8n_delete_workflow({ id })`
  - `n8n_list_workflows({ limit?, cursor?, active?, tags?, projectId?, excludePinnedData? })`
  - `n8n_validate_workflow({ id, options? })` — валидирует воркфлоу, полученный из n8n API.
- Выполнения:
  - `n8n_trigger_webhook_workflow({ webhookUrl, httpMethod?, data?, headers?, waitForResponse? })`
  - `n8n_get_execution({ id, includeData? })`, `n8n_list_executions({ limit?, cursor?, workflowId?, projectId?, status?, includeData? })`, `n8n_delete_execution({ id })`
- Система:
  - `n8n_health_check()` — доступность n8n/API и поддерживаемые возможности.
  - `n8n_list_available_tools()` — какие инструменты управления доступны при текущей конфигурации.
  - `n8n_diagnostic({ verbose? })` — диагностика конфигурации/доступности API/переменных окружения.

### Запросы/ответы: что отправлять и чего ожидать

Формат MCP JSON‑RPC по HTTP (Fixed):
- Заголовки: `Content-Type: application/json`, `Authorization: Bearer <AUTH_TOKEN>`.
- Метод JSON‑RPC и параметры в теле.

Пример: инициализация
```json
{ "jsonrpc": "2.0", "id": 1, "method": "initialize", "params": { "protocolVersion": "2025-03-26", "capabilities": {"tools": {}}, "clientInfo": {"name": "your-client", "version": "x.y.z"} } }
```

Пример: список инструментов
```json
{ "jsonrpc": "2.0", "id": 2, "method": "tools/list" }
```

Пример: вызов инструмента `get_node_essentials`
```json
{ "jsonrpc": "2.0", "id": 3, "method": "tools/call", "params": { "name": "get_node_essentials", "arguments": { "nodeType": "nodes-base.httpRequest" } } }
```

Ответ MCP:
- Всегда содержит `result.content[0].text` (строка), иногда `structuredContent` для валидационных инструментов (соответствует `outputSchema`).
- Большие ответы могут быть усечены до ~1MB с пометкой о тримминге.
- Ошибки — в виде `error.code` и `error.message`; в ответах‑ошибках для call сервер дополняет текст подсказками (частые проблемы: отсутствие обязательных полей, типовые несоответствия, неизвестные категории/ресурсы).

Ожидаемая семантика ответов по ключевым инструментам:
- `get_node_essentials` — `requiredProperties[]`, `commonProperties[]`, `operations[]`, `metadata` (флаги isAI/isTrigger/isWebhook, наличие cred, пакет, стиль).
- `validate_node_operation` — `valid`, `errors[]`, `warnings[]`, `suggestions[]`, `summary` (счётчики).
- `validate_workflow` — `valid`, `summary` (узлы/триггеры/связи/выражения/счётчики), опционально списки `errors[]/warnings[]/suggestions[]`.
- `list_nodes/search_nodes` — коллекции с `nodeType`, `workflowNodeType`, `displayName`, `description`, `category`, `package` и т.п.

### Особенности обработки и совместимость

- Нормализация типов узлов: сервер принимает `nodes-base.*`, `n8n-nodes-base.*`, `@n8n/n8n-nodes-langchain.*` — выполняется приведение к внутреннему формату, а также поиск «альтернатив» для edge‑кейсов/регистровых расхождений.
- Ответы для н8n‑клиентов могут быть преобразованы в «n8n‑friendly» описания.
- Валидация входов инструментов: строгая, с понятными сообщениями об ошибках; часть инструментов допускает дополнительные свойства (совместимость с клиентами), но полевая схема проверяется.

### Примеры curl

Инициализация (Fixed HTTP):
```bash
curl -sS -X POST "$BASE_URL/mcp" \
  -H "Authorization: Bearer $AUTH_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2025-03-26","capabilities":{"tools":{}},"clientInfo":{"name":"curl","version":"0"}}}'
```

Вызов `search_nodes`:
```bash
curl -sS -X POST "$BASE_URL/mcp" \
  -H "Authorization: Bearer $AUTH_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":2,"method":"tools/call","params":{"name":"search_nodes","arguments":{"query":"webhook","limit":10}}}'
```

Вызов `validate_node_operation`:
```bash
curl -sS -X POST "$BASE_URL/mcp" \
  -H "Authorization: Bearer $AUTH_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":3,"method":"tools/call","params":{"name":"validate_node_operation","arguments":{"nodeType":"nodes-base.httpRequest","config":{"method":"GET","url":"https://example.com"},"profile":"runtime"}}}'
```

### Рекомендации по использованию

1) Всегда начинайте с discovery:
- `search_nodes` → `get_node_essentials` → (при необходимости) `get_node_info`.
2) Перед сборкой проверяйте конфигурации узлов:
- `validate_node_minimal`/`validate_node_operation`.
3) Соберите воркфлоу, затем выполните итоговую проверку:
- `validate_workflow` (+ при необходимости `validate_workflow_connections`/`validate_workflow_expressions`).
4) При наличии n8n API — создавайте/обновляйте воркфлоу через `n8n_*` инструменты. Для больших/частых правок — `n8n_update_partial_workflow` (экономит токены).

### Диагностика

- Проверка живости сервера: `GET /health`.
- Проверка доступности инструментов управления: `n8n_list_available_tools` и `n8n_diagnostic`.
- При HTTP — тщательно проверяйте `Authorization: Bearer` и содержимое тела JSON‑RPC. В логах сервера есть подробные сообщения о причинах отказа (без утечки чувствительных данных на проде).

### Ограничения и примечания

- Ограничение размера ответа ~1MB (для избежания проблем на клиентах). Большие ответы сокращаются.
- В окружениях без FTS5 поиск падает на LIKE; для задач со сложными запросами используйте точные фразы в кавычках или режим AND.
- Для community‑узлов как AI‑tools может потребоваться `N8N_COMMUNITY_PACKAGES_ALLOW_TOOL_USAGE=true` на стороне n8n.

### Ссылки и запуск

- Быстрый старт: `npx n8n-mcp` (stdio) или Docker‑образ `ghcr.io/czlonkowski/n8n-mcp:latest` (HTTP). В Docker Compose `AUTH_TOKEN` обязателен.
- Для удалённого HTTP‑доступа и Claude Desktop используйте `MCP_MODE=http` и прокиньте токен. В конфиге Claude указывайте команду запуска или docker run c `-i`.


