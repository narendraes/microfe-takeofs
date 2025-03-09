import { AllowListRule, QueryIntent } from './types';

// Define the allow-list rules
const ALLOW_LIST_RULES: AllowListRule[] = [
  {
    intent: 'issue_reporting',
    allowedActions: ['read', 'aggregate', 'format'],
    jiraObjects: ['issue', 'bug', 'story', 'task'],
    permissionsRequired: ['jira:read'],
  },
  {
    intent: 'sprint_reporting',
    allowedActions: ['read', 'aggregate', 'format'],
    jiraObjects: ['sprint', 'board'],
    permissionsRequired: ['jira:read'],
  },
  {
    intent: 'project_reporting',
    allowedActions: ['read', 'aggregate', 'format'],
    jiraObjects: ['project', 'epic'],
    permissionsRequired: ['jira:read'],
  },
  {
    intent: 'user_reporting',
    allowedActions: ['read', 'aggregate', 'format'],
    jiraObjects: ['user', 'assignee', 'reporter'],
    permissionsRequired: ['jira:read'],
  },
  {
    intent: 'release_notes_generation',
    allowedActions: ['read', 'aggregate', 'format'],
    jiraObjects: ['issue', 'fixVersion'],
    permissionsRequired: ['jira:read'],
  },
  {
    intent: 'connection_check',
    allowedActions: ['read'],
    jiraObjects: ['connection', 'server', 'status'],
    permissionsRequired: ['jira:read'],
  },
  {
    intent: 'general_knowledge',
    allowedActions: ['explain', 'describe', 'define'],
    jiraObjects: ['jira', 'jql', 'agile', 'scrum', 'kanban', 'workflow', 'product_discovery'],
    permissionsRequired: [],
  },
  {
    intent: 'app_configuration',
    allowedActions: ['explain', 'describe', 'help'],
    jiraObjects: ['app', 'configuration', 'setup', 'settings', 'features', 'usage', 'promptdojo'],
    permissionsRequired: [],
  },
];

// Keywords that indicate a general knowledge question
const GENERAL_KNOWLEDGE_KEYWORDS = [
  'what is', 'what are', 'how does', 'explain', 'describe', 'definition',
  'tell me about', 'information about', 'help me understand', 'guide',
  'tutorial', 'overview', 'introduction', 'basics', 'fundamentals'
];

// Keywords that indicate an app configuration question
const APP_CONFIGURATION_KEYWORDS = [
  'how to', 'how do i', 'can i', 'is it possible', 'setup', 'configure',
  'settings', 'options', 'preferences', 'feature', 'functionality',
  'this app', 'the app', 'promptdojo', 'application', 'tool', 'interface',
  'using', 'usage', 'work with', 'connect', 'integration'
];

export function validateQueryIntent(intent: QueryIntent): {
  isAllowed: boolean;
  reason?: string;
  isGeneralKnowledge?: boolean;
  isAppConfiguration?: boolean;
} {
  console.log('[AllowList] Validating query intent:', intent);
  
  // Check if the intent category is valid
  if (!['reporting', 'data_retrieval', 'analysis', 'connection_check', 'general_knowledge', 'app_configuration', 'undefined'].includes(intent.category)) {
    console.log(`[AllowList] Invalid intent category: ${intent.category}`);
    return {
      isAllowed: false,
      reason: `Intent category "${intent.category}" is not supported.`,
    };
  }

  // Special case for connection check queries
  if (intent.category === 'connection_check') {
    console.log('[AllowList] Connection check query detected, allowing');
    return { isAllowed: true };
  }
  
  // Special case for general knowledge queries
  if (intent.category === 'general_knowledge') {
    console.log('[AllowList] General knowledge query detected, allowing');
    return { 
      isAllowed: true,
      isGeneralKnowledge: true
    };
  }
  
  // Special case for app configuration queries
  if (intent.category === 'app_configuration') {
    console.log('[AllowList] App configuration query detected, allowing');
    return { 
      isAllowed: true,
      isAppConfiguration: true
    };
  }

  // Check if all actions are allowed
  const allowedActions = new Set<string>();
  ALLOW_LIST_RULES.forEach((rule) => {
    rule.allowedActions.forEach((action) => allowedActions.add(action));
  });
  console.log('[AllowList] Allowed actions:', [...allowedActions]);

  const disallowedActions = intent.actions.filter((action) => !allowedActions.has(action));
  if (disallowedActions.length > 0) {
    console.log('[AllowList] Disallowed actions found:', disallowedActions);
    return {
      isAllowed: false,
      reason: `The following actions are not allowed: ${disallowedActions.join(', ')}`,
    };
  }

  // Check if all Jira objects are allowed
  const allowedObjects = new Set<string>();
  ALLOW_LIST_RULES.forEach((rule) => {
    rule.jiraObjects.forEach((obj) => allowedObjects.add(obj));
  });
  console.log('[AllowList] Allowed Jira objects:', [...allowedObjects]);

  const disallowedObjects = intent.jiraObjects.filter((obj) => !allowedObjects.has(obj));
  if (disallowedObjects.length > 0) {
    console.log('[AllowList] Disallowed Jira objects found:', disallowedObjects);
    return {
      isAllowed: false,
      reason: `The following Jira objects are not allowed: ${disallowedObjects.join(', ')}`,
    };
  }

  // Check if there's at least one rule that allows this combination of actions and objects
  let isAllowed = false;
  let isGeneralKnowledge = false;
  let isAppConfiguration = false;
  
  for (const rule of ALLOW_LIST_RULES) {
    const hasAllowedActions = intent.actions.every((action) => rule.allowedActions.includes(action));
    const hasAllowedObjects = intent.jiraObjects.every((obj) => rule.jiraObjects.includes(obj));
    
    console.log(`[AllowList] Checking rule ${rule.intent}:`, { 
      hasAllowedActions, 
      hasAllowedObjects,
      ruleActions: rule.allowedActions,
      ruleObjects: rule.jiraObjects
    });
    
    if (hasAllowedActions && hasAllowedObjects) {
      isAllowed = true;
      isGeneralKnowledge = rule.intent === 'general_knowledge';
      isAppConfiguration = rule.intent === 'app_configuration';
      console.log(`[AllowList] Query allowed by rule: ${rule.intent}`);
      break;
    }
  }

  if (!isAllowed) {
    console.log('[AllowList] No matching rule found for this combination of actions and objects');
    return {
      isAllowed: false,
      reason: 'The combination of actions and Jira objects is not allowed by any rule.',
    };
  }

  console.log('[AllowList] Query intent is allowed');
  return { 
    isAllowed: true,
    isGeneralKnowledge,
    isAppConfiguration
  };
} 