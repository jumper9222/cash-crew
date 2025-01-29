import { createAsyncThunk } from "@reduxjs/toolkit";
import { arrayUnion, collection, doc, getDoc, getDocs, query, setDoc, where } from "firebase/firestore";
import { db } from "../../firebase";

export const addFriend = createAsyncThunk(
    "friends/addFriend",
    async ({ email, uid }) => {
        const q = query(collection(db, 'users'), where('email', '==', email));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.docs.length > 0) {
            const { email } = querySnapshot.docs[0].data()
            console.log('user found', querySnapshot.docs[0].data());
            const docRef = doc(db, 'users/', uid)
            await setDoc(docRef, { friends: arrayUnion(email) }, { merge: true })
            return querySnapshot.docs[0].data();
        } else {
            console.log(querySnapshot.docs[0].data(), 'cannot find user')
        }
    })

export const fetchFriendsByEmail = createAsyncThunk(
    "friends/fetchFriendsByEmail",
    async (uid) => {
        const userRef = doc(db, 'users', uid);
        const userDoc = await getDoc(userRef);
        const friendsArray = userDoc.data().friends;
        if (!friendsArray) return

        const usersRef = collection(db, 'users');
        const fetchFriends = async (usersRef, chunk) => {
            const friendsQuery = query(usersRef, where('email', 'in', chunk));
            const friendsSnapshot = await getDocs(friendsQuery)
                .catch(error => console.error(error.message))
            return friendsSnapshot.docs.map((doc) => doc.data())
        }

        if (friendsArray.length > 10) {
            let batchedFriendsArray = []
            for (i = 0; i < friendsArray.length; i += 10) {
                batchedFriendsArray.push(friendsArray.slice(i, i + 10))
            }
            const fetchedFriends = await Promise.all(batchedFriendsArray.map(async (chunk) => {
                return fetchFriends(usersRef, chunk);
            }))
            return fetchedFriends.flat()
        } else {
            return fetchFriends(usersRef, friendsArray);
        }
    }
)