import axios from 'axios';
import { logger } from '../utils/logger';

export interface TemplateNode {
  id: number;
  name: string;
  icon: string;
}

export interface TemplateCategory {
  id: number;
  name: string;
}

export interface TemplateUser {
  id: number;
  name: string;
  username: string;
  verified: boolean;
}

export interface TemplateWorkflow {
  id: number;
  name: string;
  description: string;
  totalViews?: number; // some responses expose `views`/`recentViews` instead
  views?: number;
  recentViews?: number;
  createdAt: string;
  updatedAt?: string; // Prefer for freshness filtering when available
  user: TemplateUser;
  nodes: TemplateNode[];
  categories?: TemplateCategory[];
}

export interface TemplateDetail {
  id: number;
  name: string;
  description: string;
  views: number;
  createdAt: string;
  workflow: {
    nodes: any[];
    connections: any;
    settings?: any;
  };
}

export class TemplateFetcher {
  private readonly baseUrl = 'https://api.n8n.io/api/templates';
  private readonly pageSize = 100;
  private readonly maxRetries = 5;
  private readonly baseDelayMs = 800;
  
  private async withRetry<T>(fn: () => Promise<T>, context: string): Promise<T> {
    let attempt = 0;
    let lastErr: any;
    while (attempt < this.maxRetries) {
      try {
        return await fn();
      } catch (err: any) {
        lastErr = err;
        attempt++;
        const status = err?.response?.status;
        const retriable = status === 429 || status >= 500 || status === undefined;
        if (!retriable || attempt >= this.maxRetries) break;
        const delay = this.baseDelayMs * Math.pow(2, attempt - 1);
        logger.warn(`Retry ${attempt}/${this.maxRetries} after error in ${context}: ${status ?? err?.code ?? err?.message}. Waiting ${delay}ms`);
        await new Promise(r => setTimeout(r, delay));
      }
    }
    throw lastErr;
  }
  
  async fetchTemplates(progressCallback?: (current: number, total: number) => void): Promise<TemplateWorkflow[]> {
    const allTemplates: TemplateWorkflow[] = [];
    let page = 1;
    let hasMore = true;
    
    logger.info('Starting template fetch from n8n.io API');
    
    while (hasMore) {
      try {
        const response = await this.withRetry(() => axios.get(`${this.baseUrl}/search`, {
          params: {
            page,
            rows: this.pageSize,
            sort_by: 'last-updated'
          }
        }), `templates page ${page}`);
        
        const { workflows, totalWorkflows } = response.data;
        
        // Normalize categories across possible API shapes
        const normalized = workflows.map((w: any) => {
          const raw = w?.categories ?? w?.tags ?? w?.category;
          let categories: TemplateCategory[] | undefined;
          if (Array.isArray(raw)) {
            if (raw.length > 0 && typeof raw[0] === 'string') {
              categories = (raw as string[]).map((name, idx) => ({ id: idx, name }));
            } else if (raw.length > 0 && typeof raw[0] === 'object') {
              categories = (raw as any[])
                .map((c, idx) => {
                  const name = c?.name ?? c?.label ?? c?.title;
                  return name ? { id: c?.id ?? idx, name } as TemplateCategory : undefined;
                })
                .filter(Boolean) as TemplateCategory[];
            }
          } else if (typeof raw === 'string') {
            // Handle comma/semicolon separated strings
            const parts = raw.split(/[,;]/).map(s => s.trim()).filter(Boolean);
            categories = parts.map((name, idx) => ({ id: idx, name }));
          }

          if (categories && categories.length) {
            w.categories = categories;
          }
          return w as TemplateWorkflow;
        });
        
        // Push all templates without date filtering
        allTemplates.push(...normalized);
        
        if (progressCallback) {
          progressCallback(allTemplates.length, totalWorkflows ?? allTemplates.length);
        }
        
        // Check if there are more pages
        if (workflows.length < this.pageSize || (typeof totalWorkflows === 'number' && allTemplates.length >= totalWorkflows)) {
          hasMore = false;
        }
        
        page++;
        
        // Rate limiting - be nice to the API
        if (hasMore) {
          await this.sleep(500); // 500ms between requests
        }
      } catch (error) {
        logger.error(`Error fetching templates page ${page}:`, error);
        throw error;
      }
    }
    
    logger.info(`Fetched ${allTemplates.length} templates (no date filters)`);
    return allTemplates;
  }
  
  async fetchTemplateDetail(workflowId: number): Promise<TemplateDetail> {
    try {
      const response = await this.withRetry(() => axios.get(`${this.baseUrl}/workflows/${workflowId}`), `template detail ${workflowId}`);
      return response.data.workflow;
    } catch (error) {
      logger.error(`Error fetching template detail for ${workflowId}:`, error);
      throw error;
    }
  }
  
  async fetchAllTemplateDetails(
    workflows: TemplateWorkflow[], 
    progressCallback?: (current: number, total: number) => void
  ): Promise<Map<number, TemplateDetail>> {
    const details = new Map<number, TemplateDetail>();
    
    logger.info(`Fetching details for ${workflows.length} templates`);
    
    for (let i = 0; i < workflows.length; i++) {
      const workflow = workflows[i];
      
      try {
        const detail = await this.fetchTemplateDetail(workflow.id);
        details.set(workflow.id, detail);
        
        if (progressCallback) {
          progressCallback(i + 1, workflows.length);
        }
        
        // Rate limiting
        await this.sleep(200); // 200ms between requests
      } catch (error) {
        logger.error(`Failed to fetch details for workflow ${workflow.id}:`, error);
        // Continue with other templates
      }
    }
    
    logger.info(`Successfully fetched ${details.size} template details`);
    return details;
  }
  
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}