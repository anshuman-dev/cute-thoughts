import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertThoughtSchema, insertSocialShareSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Debug endpoint to check storage state
  app.get("/api/debug/storage", async (req, res) => {
    try {
      const allThoughts = await storage.getAllThoughts();
      res.json({
        totalThoughts: allThoughts.length,
        thoughts: allThoughts,
        message: "Storage debug info"
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to get debug info" });
    }
  });

  // Get all thoughts
  app.get("/api/thoughts", async (req, res) => {
    try {
      const thoughts = await storage.getAllThoughts();
      console.log(`📊 GET /api/thoughts - returning ${thoughts.length} thoughts`);
      res.json(thoughts);
    } catch (error) {
      console.error('❌ Error in GET /api/thoughts:', error);
      res.status(500).json({ message: "Failed to fetch thoughts" });
    }
  });

  // Get thoughts by user address with pagination
  app.get("/api/thoughts/user/:address", async (req, res) => {
    try {
      const { address } = req.params;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const offset = (page - 1) * limit;
      
      console.log(`🔍 GET /api/thoughts/user/${address} - page ${page}, limit ${limit}`);
      
      const result = await storage.getThoughtsByUserPaginated(address, limit, offset);
      
      console.log(`📊 Found ${result.total} total thoughts for user ${address}, returning ${result.thoughts.length} for this page`);
      
      const response = {
        thoughts: result.thoughts,
        pagination: {
          page,
          limit,
          total: result.total,
          totalPages: Math.ceil(result.total / limit),
          hasNext: page * limit < result.total,
          hasPrev: page > 1
        }
      };
      
      res.json(response);
    } catch (error) {
      console.error('❌ Error in GET /api/thoughts/user/:address:', error);
      res.status(500).json({ message: "Failed to fetch user thoughts" });
    }
  });

  // Create a new thought
  app.post("/api/thoughts", async (req, res) => {
    try {
      console.log('💾 POST /api/thoughts - received data:', req.body);
      
      const validatedData = insertThoughtSchema.parse(req.body);
      console.log('✅ Validation passed:', validatedData);
      
      const thought = await storage.createThought(validatedData);
      console.log('✅ Thought created successfully:', thought);
      
      res.status(201).json(thought);
    } catch (error) {
      console.error('❌ Error in POST /api/thoughts:', error);
      
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Failed to create thought" });
      }
    }
  });

  // Create a social share
  app.post("/api/social-shares", async (req, res) => {
    try {
      const validatedData = insertSocialShareSchema.parse(req.body);
      const share = await storage.createSocialShare(validatedData);
      res.status(201).json(share);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Failed to create social share" });
      }
    }
  });

  // Get social shares for a thought
  app.get("/api/social-shares/thought/:thoughtId", async (req, res) => {
    try {
      const { thoughtId } = req.params;
      const shares = await storage.getSocialSharesByThought(thoughtId);
      res.json(shares);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch social shares" });
    }
  });

  // Twitter/X sharing endpoint (for analytics)
  app.post("/api/share/twitter", async (req, res) => {
    try {
      const { thoughtId, text } = req.body;
      
      // Create social share record
      const shareData = {
        thoughtId,
        platform: "twitter",
        shareUrl: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`,
        shared: true
      };
      
      const share = await storage.createSocialShare(shareData);
      res.json({ success: true, share });
    } catch (error) {
      res.status(500).json({ message: "Failed to process Twitter share" });
    }
  });

  // Farcaster sharing endpoint (for analytics)
  app.post("/api/share/farcaster", async (req, res) => {
    try {
      const { thoughtId, text } = req.body;
      
      const shareData = {
        thoughtId,
        platform: "farcaster",
        shareUrl: `https://warpcast.com/~/compose?text=${encodeURIComponent(text)}`,
        shared: true
      };
      
      const share = await storage.createSocialShare(shareData);
      res.json({ success: true, share });
    } catch (error) {
      res.status(500).json({ message: "Failed to process Farcaster share" });
    }
  });

  // Instagram sharing endpoint (for analytics)
  app.post("/api/share/instagram", async (req, res) => {
    try {
      const { thoughtId, text } = req.body;
      
      const shareData = {
        thoughtId,
        platform: "instagram",
        shareUrl: "", // Instagram doesn't have direct URL sharing
        shared: true
      };
      
      const share = await storage.createSocialShare(shareData);
      res.json({ success: true, share });
    } catch (error) {
      res.status(500).json({ message: "Failed to process Instagram share" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
