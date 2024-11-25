import { db } from "@/firebaseConfig";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  WhereFilterOp,
} from "firebase/firestore";

// Fetch all documents from a collection
export const fetchDocuments = async (collectionName: string) => {
  const collectionRef = collection(db, collectionName);
  const snapshot = await getDocs(collectionRef);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

// Get all documents in a collection
export const getAllDocuments = async (collectionName: string) => {
  const collectionRef = collection(db, collectionName);
  const snapshot = await getDocs(collectionRef);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

// Get a single document by ID
export const getDocumentById = async (collectionName: string, id: string) => {
  const docRef = doc(db, collectionName, id);
  const snapshot = await getDoc(docRef);
  if (!snapshot.exists()) {
    throw new Error(`Document with ID ${id} does not exist in ${collectionName}`);
  }
  return { id: snapshot.id, ...snapshot.data() };
};

// Add a new document
export const addDocument = async (collectionName: string, data: object) => {
  const collectionRef = collection(db, collectionName);
  const docRef = await addDoc(collectionRef, data);
  return docRef.id;
};

// Update an existing document
export const updateDocument = async (collectionName: string, id: string, data: object) => {
  const docRef = doc(db, collectionName, id);
  await updateDoc(docRef, data);
};

// Delete a document
export const deleteDocument = async (collectionName: string, id: string) => {
  const docRef = doc(db, collectionName, id);
  await deleteDoc(docRef);
};

// Query documents by field
export const queryDocuments = async (
  collectionName: string,
  field: string,
  operator: WhereFilterOp,
  value: any
) => {
  const collectionRef = collection(db, collectionName);
  const q = query(collectionRef, where(field, operator, value));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

// Toggle availability of a document
export const toggleAvailability = async (collectionName: string, id: string) => {
    try {
      console.log(`Fetching document with ID: ${id} from collection: ${collectionName}`);
      const docRef = doc(db, collectionName, id);
      const snapshot = await getDoc(docRef);
  
      if (!snapshot.exists()) {
        console.error(`Document with ID ${id} does not exist.`);
        throw new Error(`Document with ID ${id} does not exist in ${collectionName}.`);
      }
  
      const currentData = snapshot.data();
      console.log("Current document data:", currentData);
  
      if (currentData?.availability === undefined || typeof currentData.availability !== "boolean") {
        console.error("Invalid document structure or missing 'availability' field.");
        throw new Error(
          `Invalid document structure or missing 'availability' field for document ID ${id}.`
        );
      }
  
      const newAvailability = !currentData.availability;
  
      console.log(
        `Updating availability for document with ID ${id} to: ${newAvailability}`
      );
  
      await updateDoc(docRef, { availability: newAvailability });
  
      console.log(`Successfully updated availability for document ID ${id}.`);
      return newAvailability;
    } catch (error: any) {
      console.error("Error toggling availability:", error.message || error);
      throw new Error("Failed to update document availability. Check your setup.");
    }
  };
  
  
