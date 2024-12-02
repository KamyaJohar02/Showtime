import { getAuth } from "firebase/auth"; // Import the correct function
import { db } from "@/firebaseConfig"; // Ensure this is correctly initialized
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

const auth = getAuth();
const user = auth.currentUser;

if (user) {
  // Proceed with Firestore operations if the user is authenticated
  const userRef = doc(db, "adminusers", user.uid); // Correct way to get document reference

  // Fetch document data
  const getUserData = async () => {
    const snapshot = await getDoc(userRef);
    if (snapshot.exists()) {
      return snapshot.data(); // Document data
    } else {
      throw new Error("User not found");
    }
  };

  // Example of using getUserData
  getUserData()
    .then((data) => {
      console.log(data); // Handle user data
    })
    .catch((error) => {
      console.error(error);
    });
}

// Firestore CRUD functions

// Get all documents in a collection
export const getAllDocuments = async (collectionName: string) => {
  const collectionRef = collection(db, collectionName); // Modular import for collection
  const snapshot = await getDocs(collectionRef);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

// Get a single document by ID
export const getDocumentById = async (collectionName: string, id: string) => {
  const docRef = doc(db, collectionName, id); // Modular import for doc
  const snapshot = await getDoc(docRef);
  if (!snapshot.exists()) {
    throw new Error(`Document with ID ${id} does not exist in ${collectionName}`);
  }
  return { id: snapshot.id, ...snapshot.data() };
};

// Add a new document
export const addDocument = async (collectionName: string, data: object) => {
  const collectionRef = collection(db, collectionName); // Modular import for collection
  const docRef = await addDoc(collectionRef, data);
  return docRef.id;
};

// Update an existing document
export const updateDocument = async (collectionName: string, id: string, data: object) => {
  const docRef = doc(db, collectionName, id); // Modular import for doc
  await updateDoc(docRef, data);
};

// Delete a document
export const deleteDocument = async (collectionName: string, id: string) => {
  const docRef = doc(db, collectionName, id); // Modular import for doc
  await deleteDoc(docRef);
};

// Query documents by field
export const queryDocuments = async (
  collectionName: string,
  field: string,
  operator: WhereFilterOp,
  value: any
) => {
  const collectionRef = collection(db, collectionName); // Modular import for collection
  const q = query(collectionRef, where(field, operator, value));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

// Toggle availability of a document
export const toggleAvailability = async (collectionName: string, id: string) => {
  try {
    const docRef = doc(db, collectionName, id); // Modular import for doc
    const snapshot = await getDoc(docRef);

    if (!snapshot.exists()) {
      throw new Error(`Document with ID ${id} does not exist.`);
    }

    const currentData = snapshot.data();
    if (
      currentData?.availability === undefined ||
      typeof currentData.availability !== "boolean"
    ) {
      throw new Error(`Invalid document structure or missing 'availability' field.`);
    }

    const newAvailability = !currentData.availability;
    await updateDoc(docRef, { availability: newAvailability });

    return newAvailability;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to update document availability: ${error.message}`);
    } else {
      throw new Error("An unknown error occurred while updating availability.");
    }
  }
};
