import { doc, setDoc, updateDoc } from "firebase/firestore"
import { db, auth } from "../../firebase"

export const updateUserProfile = async (updatedUserData) => {
    auth.currentUser.updateUserProfile()
    const userRef = doc(db, 'users' + auth.currentUser.uid)
    await updateDoc(userRef, updatedUserData)
}

//Set user doc in users collection after signing up
export const setUserDoc = async (userCredentials) => {
    const { displayName, email, phoneNumber, photoURL, uid } = userCredentials
    const userRef = doc(db, 'users', uid)
    await setDoc(userRef, { displayName, email, phoneNumber, photoURL, uid }, { merge: true })
}


