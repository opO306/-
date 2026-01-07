import * as admin from "firebase-admin";

export type Title = {
  id: string;
  name: string;
  description?: string; // Optional, for future use in UI
  tags: string[]; // Added tags for synthesis
  createdAt: admin.firestore.Timestamp;
};

export type CompositeJob = {
  id: string;
  name: string;
  toneTags: string[];
  baseJobId: string;
  activeTitleId: string;
  createdAt: admin.firestore.Timestamp;
};

