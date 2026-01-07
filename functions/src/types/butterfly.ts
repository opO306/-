import * as admin from "firebase-admin";

export type ButterflyMark = {
  key: string;
  weight: number;
  at: admin.firestore.Timestamp;
};

