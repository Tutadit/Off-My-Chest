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

const getLeveles = (category) => {
  let level1, level2, level3, level4, level5;
  let cat = category.label.split("/");
  for (let i = 1; i < 6; i++) {
    // eslint-disable-next-line default-case
    switch (i) {
      case 1:
        level1 = cat[1];
        break;
      case 2:
        level2 = cat[2];
        break;
      case 3:
        level3 = cat[3];
        break;
      case 4:
        level4 = cat[4];
        break;
      case 5:
        level5 = cat[5];
        break;
    }
  }
  return {
    level1: level1 ? level1 : "",
    level2: level2 ? level2 : "",
    level3: level3 ? level3 : "",
    level4: level4 ? level4 : "",
    level5: level5 ? level5 : "",
  };
};

const addPost = async (audio, transcript) => {
  const analysis = await nlu(transcript);
  let pid = nanoid();
  console.log({
    pid: pid,
    audio_file: await uploadPostAudio(pid, audio),
    transcript: transcript,
    nlu_analysis: analysis,
    ...getLeveles(analysis.result.categories[0]),
  });
  try {    
    await setDoc(doc(db, "posts", pid), {
      pid: pid,
      audio_file: await uploadPostAudio(pid, audio),
      transcript: transcript,
      nlu_analysis: analysis,
      ...getLeveles(analysis.result.categories[0]),
    });
    return pid;
  } catch (err) {
    console.log("Oh no")
    console.log(err);
  }
};

const nlu = async (params) => {
  if (typeof params === "string") params = { text: params };

  // https://console.bluemix.net/apidocs/natural-language-understanding?language=node#text-analytics-features
  params.features = params.features || {
    categories: {},
    concepts: {},
    emotion: { document: true },
    entities: { mentions: true, emotion: true, sentiment: true },
    keywords: { emotion: true, sentiment: true },
    relations: {},
    sentiment: { document: true },
    semantic_roles: {},
    syntax: {
      sentences: true,
      tokens: {
        lemma: true,
        part_of_speech: true,
      },
    },
  };

  if (params.url) params.features.metadata = {};

  const req = new Request("https://ibm-nlu.glitch.me/", {
    method: "POST",
    mode: "cors",
    headers: new Headers({
      "Content-Type": "application/json",
    }),
    body: JSON.stringify(params),
  });

  return fetch(req)
    .then((response) => response.json())
    .then((json) => json)
    .catch((e) => console.log(e));
};

export {
  queryAllPosts,
  queryPostsByLevels,
  queryPostByPid,
  queryCommentsByPid,
  addComment,
  addPost,
};
