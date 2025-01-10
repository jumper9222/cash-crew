import { createAsyncThunk } from "@reduxjs/toolkit";
import { collection, doc, getDocs, query, setDoc, where } from "firebase/firestore";
import { db } from "../../firebase";

export const addFriend = createAsyncThunk(
    "friends/addFriend",
    async ({ email, uid }) => {
        const q = query(collection(db, 'users'), where('email', '==', email));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.docs.length > 0) {
            const { email, ...rest } = querySnapshot.docs[0].data()
            console.log('user found', querySnapshot.docs[0].data());
            const docRef = doc(db, 'users/' + uid + '/friends', email)
            await setDoc(docRef, { email, ...rest }, { merge: true })
            return querySnapshot.docs[0].data();
        } else {
            console.log(querySnapshot.docs[0].data(), 'cannot find user')
        }
    })

export const fetchFriendsByUserId = createAsyncThunk(
    "friends/fetchFriendsByUserId",
    async (uid) => {
        const querySnapshot = await getDocs(collection(db, 'users', uid, 'friends'))
        const friends = querySnapshot.docs.map((doc) => doc.data())
        return friends;
    }
)