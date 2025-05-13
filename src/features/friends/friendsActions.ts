import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  arrayUnion,
  doc,
  DocumentData,
  DocumentSnapshot,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../../firebase";
import { Friend } from "../../types/friends.types";
import { usersCollection } from "../../configs/firestoreRefs";

//ACTION to add friend
export const addFriend = createAsyncThunk(
  "friends/addFriend",
  async ({
    email,
    currentUserUid,
  }: {
    email: string;
    currentUserUid: string;
  }): Promise<Friend | undefined> => {
    const q = query(usersCollection, where("email", "==", email));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.docs.length > 0) {
      const { email, photoURL, displayName, uid } =
        querySnapshot.docs[0].data();
      const newFriend: Friend = { email, photoURL, displayName, uid };
      console.log("user found", querySnapshot.docs[0].data());
      const userRef = doc(db, "users", currentUserUid);
      await updateDoc(userRef, { friends: arrayUnion(email) });
      return newFriend;
    } else {
      throw new Error("User not found");
    }
  }
);

//HELPER FUNCTION to map friends from snapshot docs to Friend type
const mapFriends = (
  snapshotDocs: DocumentSnapshot<DocumentData>[]
): Friend[] => {
  return snapshotDocs.map((doc) => {
    const { email, photoURL, displayName, uid } = doc.data() as Friend;
    return { email, photoURL, displayName, uid };
  });
};

//HELPER FUNCtION to fetch friends by email
const fetchFriends = async (chunk: string[]): Promise<Friend[] | undefined> => {
  const friendsQuery = query(usersCollection, where("email", "in", chunk));
  const friendsSnapshot = await getDocs(friendsQuery).catch((error) =>
    console.error(error.message)
  );
  if (!friendsSnapshot) return;
  const friends = mapFriends(friendsSnapshot.docs);

  return friends;
};

//MAIN FUNCTION to fetch friends by current user uid
export const fetchCurrentUserFriends = createAsyncThunk(
  "friends/fetchCurrentUserFriends",
  async (uid: string): Promise<Friend[] | undefined> => {
    const userRef = doc(db, "users", uid);
    const userDoc = await getDoc(userRef);
    const friendsArray = userDoc.data()?.friends;
    if (!friendsArray) return;

    if (friendsArray.length > 10) {
      let batchedFriendsArray = [];
      for (let i = 0; i < friendsArray.length; i += 10) {
        batchedFriendsArray.push(friendsArray.slice(i, i + 10));
      }
      const fetchedFriends = await Promise.all(
        batchedFriendsArray.map(async (chunk) => {
          return fetchFriends(chunk);
        })
      );
      return fetchedFriends.flat().filter((friend) => friend !== undefined);
    } else {
      return fetchFriends(friendsArray);
    }
  }
);
