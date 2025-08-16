import { type Thought, type InsertThought, type SocialShare, type InsertSocialShare } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Thoughts
  getThought(id: string): Promise<Thought | undefined>;
  getThoughtsByUser(userAddress: string): Promise<Thought[]>;
  createThought(thought: InsertThought): Promise<Thought>;
  getAllThoughts(): Promise<Thought[]>;
  
  // Social Shares
  getSocialShare(id: string): Promise<SocialShare | undefined>;
  createSocialShare(share: InsertSocialShare): Promise<SocialShare>;
  getSocialSharesByThought(thoughtId: string): Promise<SocialShare[]>;
}

export class MemStorage implements IStorage {
  private thoughts: Map<string, Thought>;
  private socialShares: Map<string, SocialShare>;

  constructor() {
    this.thoughts = new Map();
    this.socialShares = new Map();
  }

  async getThought(id: string): Promise<Thought | undefined> {
    return this.thoughts.get(id);
  }

  async getThoughtsByUser(userAddress: string): Promise<Thought[]> {
    return Array.from(this.thoughts.values()).filter(
      (thought) => thought.userAddress.toLowerCase() === userAddress.toLowerCase(),
    );
  }

  async createThought(insertThought: InsertThought): Promise<Thought> {
    const id = randomUUID();
    const thought: Thought = { 
      ...insertThought, 
      id,
      createdAt: new Date()
    };
    this.thoughts.set(id, thought);
    return thought;
  }

  async getAllThoughts(): Promise<Thought[]> {
    return Array.from(this.thoughts.values()).sort(
      (a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0)
    );
  }

  async getSocialShare(id: string): Promise<SocialShare | undefined> {
    return this.socialShares.get(id);
  }

  async createSocialShare(insertShare: InsertSocialShare): Promise<SocialShare> {
    const id = randomUUID();
    const share: SocialShare = { 
      ...insertShare, 
      id,
      createdAt: new Date()
    };
    this.socialShares.set(id, share);
    return share;
  }

  async getSocialSharesByThought(thoughtId: string): Promise<SocialShare[]> {
    return Array.from(this.socialShares.values()).filter(
      (share) => share.thoughtId === thoughtId
    );
  }
}

export const storage = new MemStorage();
