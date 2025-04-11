export interface Topic {
  title: string;
  relevance: number;
  description: string;
  content?: string;
  subtopics?: Subtopic[];
  references?: string[];
}

export interface Subtopic {
  title: string;
  description: string;
  content?: string;
}

export interface Module {
  title: string;
  topics: Topic[];
}

export interface UserSubscriptionType {
  type: 'free' | 'silver' | 'gold';
  usedRequests?: number;
  requestLimit?: number;
}
