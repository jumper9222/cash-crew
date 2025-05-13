import { auth, db } from "../firebase";
import { collection, doc } from "firebase/firestore/dist/firestore";

export const usersCollection = collection(db, "users");
export const currentUserDoc = doc(usersCollection, auth.currentUser?.uid);
