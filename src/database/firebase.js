// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

import {
  getFirestore,
  collection,
  doc,
  getDocs,
  setDoc,
  query,
  where,
} from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { nanoid } from "nanoid";
import { firebaseConfig } from "../env";

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const storage = getStorage(app);

const queryAllPosts = async () => {
  const q = query(collection(db, "posts"));
  const querySnapshot = await getDocs(q);
  const posts = [];
  querySnapshot.forEach((doc) => {
    posts.push(doc.data());
  });
  return posts;
};
const queryPostsByLevels = async (levels = {}) => {
  let { level1, level2, level3, level4, level5 } = levels;
  let col = collection(db, "posts");
  let q = col;

  if (level1) {
    q = query(q, where("level1", "==", level1));
  }
  if (level2) {
    q = query(q, where("level2", "==", level2));
  }
  if (level3) {
    q = query(q, where("level3", "==", level3));
  }
  if (level4) {
    q = query(q, where("level4", "==", level4));
  }
  if (level5) {
    q = query(q, where("level5", "==", level5));
  }

  const querySnapshot = await getDocs(q);
  const posts = [];
  querySnapshot.forEach((doc) => {
    posts.push(doc.data());
  });
  return posts;
};
const queryPostByPid = async (pid) => {
  const q = query(collection(db, "posts"), where("pid", "==", pid));
  const querySnapshot = await getDocs(q);
  const posts = [];
  querySnapshot.forEach((doc) => {
    posts.push(doc.data());
  });
  return posts;
};
const queryCommentsByPid = async (pid) => {
  const q = query(collection(db, "comments"), where("pid", "==", pid));
  const querySnapshot = await getDocs(q);
  const posts = [];
  querySnapshot.forEach((doc) => {
    posts.push(doc.data());
  });
  return posts;
};
const addComment = async (pid, comment, parentId = null) => {
  try {
    let comId = nanoid();
    if (comment.audio) {
      const url = await uploadCommentAudio(comId, comment.audio);
      comment.audio = url;
    }

    await setDoc(doc(db, "comments", comId), {
      pid: pid,
      comId: comId,
      parentId: parentId,
      avatarUrl:
        "https://ui-avatars.com/api/name=" +
        encodeURI(comment.fullName) +
        "&background=random",
      ...comment,
    });
    return comId;
  } catch (err) {
    throw err;
  }
};

const uploadCommentAudio = async (comId, file) => {
  let blob = await fetch(file).then((r) => r.blob());

  const storageRef = ref(storage, "comments/" + comId + ".ogg");
  let result = await uploadBytes(storageRef, blob);
  let downloadURL = await getDownloadURL(result.ref);

  return downloadURL;
};

const uploadPostAudio = async (pid, file) => {
  let blob = await fetch(file).then((r) => r.blob());

  const storageRef = ref(storage, "posts/" + pid + ".ogg");
  let result = await uploadBytes(storageRef, blob);
  let downloadURL = await getDownloadURL(result.ref);

  return downloadURL;
};

const addPost = async (audio, transcript) => {
  try {
    let pid = nanoid();
    await setDoc(doc(db, "posts", pid), {
      pid: pid,
      audio_file: await uploadPostAudio(pid, audio),
      transcript: transcript,
      ...transcriptAnalysis(transcript),
    });
    return pid;
  } catch (err) {
    throw err;
  }
};

const transcriptAnalysis = (transcript) => {
  return {
    level1: "art and entertainment",
    level2: "comics and animation",
    level3: "comics",
  };
};

export {
  queryAllPosts,
  queryPostsByLevels,
  queryPostByPid,
  queryCommentsByPid,
  addComment,
  addPost,
};
