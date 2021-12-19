// Import the functions you need from the SDKs you need
import {initializeApp} from "firebase/app";
import {getAnalytics} from "firebase/analytics";
import {
    getFirestore,
    collection,
    doc,
    getDoc,
    getDocs,
    addDoc,
    setDoc,
    query,
    where,
    updateDoc,
    arrayUnion
} from "firebase/firestore";
import {nanoid} from "nanoid";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBmgT5tpv5u6FVKczJbL570EX-tgSOjc44",
    authDomain: "off-my-chest.firebaseapp.com",
    projectId: "off-my-chest",
    storageBucket: "off-my-chest.appspot.com",
    messagingSenderId: "1087542841850",
    appId: "1:1087542841850:web:8f3b3d7e978bebad499443",
    measurementId: "G-GPC2R64T65"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

const queryAllPosts = async () => {
    const q = query(collection(db, "posts"));
    const querySnapshot = await getDocs(q);
    const posts = []
    querySnapshot.forEach((doc) => {
        posts.push(doc.data());
    });
    return posts
}
const queryPostsByLevels = async (levels = {}) => {
    let {level1, level2, level3, level4, level5} = levels;
    let query = collection(db, "posts")

    if (level1) {
        query = query.where("level1", "==", level1)
    }
    if (level2) {
        query = query.where("level2", "==", level2)
    }
    if (level3) {
        query = query.where("level3", "==", level3)
    }
    if (level4) {
        query = query.where("level4", "==", level4)
    }
    if (level5) {
        query = query.where("level4", "==", level5)
    }

    const querySnapshot = await getDocs(query);
    const posts = []
    querySnapshot.forEach((doc) => {
        posts.push(doc.data());
    });
    return posts
}
const queryPostByPid = async (pid) => {
    const q = query(collection(db, "posts"), where("pid", "==", pid));
    const querySnapshot = await getDocs(q);
    const posts = []
    querySnapshot.forEach((doc) => {
        posts.push(doc.data());
    });
    return posts
}
const queryCommentsByPid = async (pid) => {
    const q = query(collection(db, "comments"), where("pid", "==", pid));
    const querySnapshot = await getDocs(q);
    const posts = []
    querySnapshot.forEach((doc) => {
        posts.push(doc.data());
    });
    return posts
}
const addComment = async (pid, userId, fullName, avatarUrl, text) => {
    try {
        let comId = nanoid()
        await setDoc(doc(db, "comments", comId), {
            pid: pid,
            userId: userId,
            comId: comId,
            fullName: fullName,
            avatarUrl: avatarUrl,
            text: text,
            replies: []
        });

        return comId
    } catch (err) {
        throw err
    }
}
const replyToComment = async (parentId, userId, fullName, avatarUrl, text) => {
    try {
        const parentCommentRef = doc(db, "comments", parentId);
        let comId = nanoid()
        await updateDoc(parentCommentRef, {
            regions: arrayUnion({
                userId: userId,
                comId: comId,
                fullName: fullName,
                avatarUrl: avatarUrl,
                text: text
            })
        });
        return comId
    } catch (err) {
        throw err
    }
}

export {queryAllPosts, queryPostsByLevels, queryPostByPid, addComment, replyToComment}