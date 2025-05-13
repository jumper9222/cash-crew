import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db, storage } from "../../firebase";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import { CurrentUser } from "../../types/user.types";
import { currentUserDoc } from "../../configs/firestoreRefs";

//Set user doc in users collection after signing up
export const setUserDoc = createAsyncThunk(
  "currentUser/setUserDoc",
  async (userData: CurrentUser): Promise<Partial<CurrentUser>> => {
    const { displayName, email, phoneNumber, photoURL, uid } = userData;
    await setDoc(
      currentUserDoc,
      { displayName, email, phoneNumber, photoURL, uid },
      { merge: true }
    );
    return { displayName, email, phoneNumber, photoURL, uid };
  }
);

//Fetch user data from DB when logging in
export const getCurrentUserFromDB = createAsyncThunk(
  "currentUser/getCurrentUserFromDB",
  async () => {
    const userSnap = await getDoc(currentUserDoc);

    if (userSnap.exists()) {
      console.log(userSnap.data());
      return userSnap.data();
    } else {
      return null;
    }
  }
);

//Update user profile
export const updateBasicInfo = createAsyncThunk(
  "currentUser/updateBasicInfo",
  async ({ currentUser, profilePicture, displayName, birthday, gender }) => {
    //Initialize photoURL variable with existing photo url and create newProfileDetails object
    let photoURL = currentUser.photoURL;
    console.log(profilePicture);
    //Upload new profile picture if file exists and set new photoURL
    if (profilePicture) {
      // const lastDotIndex = profilePicture?.name.lastIndexOf('.')
      // const fileExtension = profilePicture?.name.subString(lastDotIndex + 1).toLowercase();
      const storageRef = ref(storage, `profile-pictures/${currentUser.uid}`);
      await uploadBytes(storageRef, profilePicture)
        .then((snapshot) => getDownloadURL(snapshot.ref))
        .then((url) => {
          photoURL = url;
          console.log(
            `Profile picture uploaded to firestore storage successfully.`
          );
        })
        .catch((error) =>
          console.error("Error uploading new profile picture: ", error.message)
        );
    }

    //update user profile details in firebase auth
    await updateProfile(auth.currentUser, { photoURL, displayName })
      .then(() => console.log("User updated successfully in firebase auth"))
      .catch((error) =>
        console.error(
          `Something went wrong when trying to update user in firebase auth: ${error.message}`
        )
      );

    //update additional user profile details in firestore database
    const newProfileDetails = { photoURL, displayName, birthday, gender };
    const userRef = doc(db, "users", currentUser.uid);
    await setDoc(userRef, newProfileDetails, { merge: true })
      .then(() => console.log("User upated successfully in database"))
      .catch((error) =>
        console.error(
          `Something went wrong when trying to update user database: ${error.message}`
        )
      );

    //Return new profile details to be handled by extra reducers
    return newProfileDetails;
  }
);
