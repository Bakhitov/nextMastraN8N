/**
 * n8n-friendly tool descriptions
 * These descriptions are optimized to reduce schema validation errors in n8n's AI Agent
 * 
 * Key principles:
 * 1. Use exact JSON examples in descriptions
 * 2. Be explicit about data types
 * 3. Keep descriptions short and directive
 * 4. Avoid ambiguity
 */

export const n8nFriendlyDescriptions: Record<string, {
  description: string;
  params: Record<string, string>;
}> = {
  // Validation tools - most prone to errors
  validate_node_operation: {
    description: 'Validate n8n node. ALWAYS pass two parameters: nodeType (string) and config (object). Example call: {"nodeType": "nodes-base.slack", "config": {"resource": "channel", "operation": "create"}}',
    params: {
      nodeType: 'String value like "nodes-base.slack"',
      config: 'Object value like {"resource": "channel", "operation": "create"} or empty object {}',
      profile: 'Optional string: "minimal" or "runtime" or "ai-friendly" or "strict"'
    }
  },
  
  validate_node_minimal: {
    description: 'Check required fields. MUST pass: nodeType (string) and config (object). Example: {"nodeType": "nodes-base.webhook", "config": {}}',
    params: {
      nodeType: 'String like "nodes-base.webhook"',
      config: 'Object, use {} for empty'
    }
  },
  
  // Search and info tools
  search_nodes: {
    description: 'Search nodes. Pass query (string). Optional: limit (number, default 20), mode ("OR"|"AND"|"FUZZY"). Example: {"query": "webhook"}',
    params: {
      query: 'String keyword like "webhook" or "database"',
      limit: 'Optional number, default 20',
      mode: 'Optional string: "OR" (default) | "AND" | "FUZZY"'
    }
  },
  
  get_node_info: {
    description: 'Get node details. Pass nodeType (string). Example: {"nodeType": "nodes-base.httpRequest"}',
    params: {
      nodeType: 'String with prefix like "nodes-base.httpRequest"'
    }
  },
  
  get_node_essentials: {
    description: 'Get node basics. Pass nodeType (string). Example: {"nodeType": "nodes-base.slack"}',
    params: {
      nodeType: 'String with prefix like "nodes-base.slack"'
    }
  },
  
  // Task tools
  get_node_for_task: {
    description: 'Find node for task. Pass task (string). Example: {"task": "send_http_request"}',
    params: {
      task: 'String task name like "send_http_request"'
    }
  },
  
  list_tasks: {
    description: 'List tasks by category. Pass category (string). Example: {"category": "HTTP/API"}',
    params: {
      category: 'String: "HTTP/API" or "Webhooks" or "Database" or "AI/LangChain" or "Data Processing" or "Communication"'
    }
  },
  
  // Workflow validation
  validate_workflow: {
    description: 'Validate workflow. Pass workflow object. MUST have: {"workflow": {"nodes": [array of node objects], "connections": {object with node connections}}}. Each node needs: name, type, typeVersion, position.',
    params: {
      workflow: 'Object with two required fields: nodes (array) and connections (object). Example: {"nodes": [{"name": "Webhook", "type": "n8n-nodes-base.webhook", "typeVersion": 2, "position": [250, 300], "parameters": {}}], "connections": {}}',
      options: 'Optional object. Example: {"validateNodes": true, "profile": "runtime"}'
    }
  },

  // Workflow activation
  n8n_set_workflow_active: {
    description: 'Activate/deactivate workflow. Example: {"id": "123", "active": true}',
    params: {
      id: 'String workflow ID',
      active: 'Boolean: true to activate, false to deactivate'
    }
  },

  // Credentials
  n8n_list_credentials: {
    description: 'List credentials. Example: {"limit": 50}',
    params: {
      limit: 'Optional number',
      cursor: 'Optional string'
    }
  },
  n8n_get_credential: {
    description: 'Get credential by ID. Example: {"id": "abc"}',
    params: { id: 'String credential ID' }
  },
  n8n_create_credential: {
    description: 'Create credential. Example: {"name":"API Key","type":"apiKey","data":{}}',
    params: {
      name: 'String name',
      type: 'String type (e.g., apiKey, slackOAuth2)',
      data: 'Object with credential fields (optional)',
      nodesAccess: 'Optional array of { nodeType }'
    }
  },
  n8n_update_credential: {
    description: 'Update credential. Example: {"id":"abc","name":"New Name"}',
    params: {
      id: 'String credential ID',
      name: 'Optional string',
      type: 'Optional string',
      data: 'Optional object',
      nodesAccess: 'Optional array'
    }
  },
  n8n_delete_credential: {
    description: 'Delete credential. Example: {"id":"abc"}',
    params: { id: 'String credential ID' }
  },

  // Tags (Pro/Enterprise)
  n8n_list_tags: {
    description: 'List tags (Pro). Example: {"limit": 50}',
    params: { limit: 'Optional number', cursor: 'Optional string', withUsageCount: 'Optional boolean' }
  },
  n8n_create_tag: {
    description: 'Create tag (Pro). Example: {"name": "high-priority"}',
    params: { name: 'String tag name' }
  },
  n8n_update_tag: {
    description: 'Update tag (Pro). Example: {"id":"t1","name":"urgent"}',
    params: { id: 'String tag ID', name: 'String new name' }
  },
  n8n_delete_tag: {
    description: 'Delete tag (Pro). Example: {"id":"t1"}',
    params: { id: 'String tag ID' }
  },

  // Variables (Pro/Enterprise)
  n8n_list_variables: {
    description: 'List variables (Pro).',
    params: {}
  },
  n8n_create_variable: {
    description: 'Create variable (Pro). Example: {"key":"ENV","value":"prod"}',
    params: { key: 'String key', value: 'String value' }
  },
  n8n_update_variable: {
    description: 'Update variable (Pro). Example: {"id":"v1","value":"staging"}',
    params: { id: 'String variable ID', value: 'String new value' }
  },
  n8n_delete_variable: {
    description: 'Delete variable (Pro). Example: {"id":"v1"}',
    params: { id: 'String variable ID' }
  },

  // Source Control (Pro/Enterprise)
  n8n_source_control_status: {
    description: 'Get source control status (Pro).',
    params: {}
  },
  n8n_source_control_pull: {
    description: 'Pull from remote (Pro). Example: {"force": true}',
    params: { force: 'Optional boolean' }
  },
  n8n_source_control_push: {
    description: 'Push to remote (Pro). Example: {"message": "Update"}',
    params: { message: 'String commit message', fileNames: 'Optional array of strings' }
  },
  
  validate_workflow_connections: {
    description: 'Validate workflow connections only. Pass workflow object. Example: {"workflow": {"nodes": [...], "connections": {}}}',
    params: {
      workflow: 'Object with nodes array and connections object. Minimal example: {"nodes": [{"name": "Webhook"}], "connections": {}}'
    }
  },
  
  validate_workflow_expressions: {
    description: 'Validate n8n expressions in workflow. Pass workflow object. Example: {"workflow": {"nodes": [...], "connections": {}}}',
    params: {
      workflow: 'Object with nodes array and connections object containing n8n expressions like {{ $json.data }}'
    }
  },
  
  // Property tools
  get_property_dependencies: {
    description: 'Get field dependencies. Pass nodeType (string) and optional config (object). Example: {"nodeType": "nodes-base.httpRequest", "config": {}}',
    params: {
      nodeType: 'String like "nodes-base.httpRequest"',
      config: 'Optional object, use {} for empty'
    }
  },
  
  // AI tool info
  get_node_as_tool_info: {
    description: 'Get AI tool usage. Pass nodeType (string). Example: {"nodeType": "nodes-base.slack"}',
    params: {
      nodeType: 'String with prefix like "nodes-base.slack"'
    }
  },
  
  // Template tools
  search_templates: {
    description: 'Search workflow templates. Pass query (string). Optional: limit (number). Example: {"query": "chatbot"}',
    params: {
      query: 'String keyword like "chatbot" or "webhook"',
      limit: 'Optional number, default 20'
    }
  },
  
  get_template: {
    description: 'Get template by ID. Pass templateId (number). Example: {"templateId": 1234}',
    params: {
      templateId: 'Number ID like 1234'
    }
  },
  
  // Documentation tool
  tools_documentation: {
    description: 'Get tool docs. Pass optional depth (string). Example: {"depth": "essentials"} or {}',
    params: {
      depth: 'Optional string: "essentials" or "full"',
      topic: 'Optional string topic name'
    }
  }
};

/**
 * Apply n8n-friendly descriptions to tools
 * This function modifies tool descriptions to be more explicit for n8n's AI agent
 */
export function makeToolsN8nFriendly(tools: any[]): any[] {
  return tools.map(tool => {
    const toolName = tool.name as string;
    const friendlyDesc = n8nFriendlyDescriptions[toolName];
    if (friendlyDesc) {
      // Clone the tool to avoid mutating the original
      const updatedTool = { ...tool };
      
      // Update the main description
      updatedTool.description = friendlyDesc.description;
      
      // Clone inputSchema if it exists
      if (tool.inputSchema?.properties) {
        updatedTool.inputSchema = {
          ...tool.inputSchema,
          properties: { ...tool.inputSchema.properties }
        };
        
        // Update parameter descriptions
        Object.keys(updatedTool.inputSchema.properties).forEach(param => {
          if (friendlyDesc.params[param]) {
            updatedTool.inputSchema.properties[param] = {
              ...updatedTool.inputSchema.properties[param],
              description: friendlyDesc.params[param]
            };
          }
        });
      }
      
      return updatedTool;
    }
    return tool;
  });
}