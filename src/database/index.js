import { useState, useEffect } from "react";

import {
  queryPostsByLevels,
  queryPostByPid,
  queryCommentsByPid,
  addComment,
} from "./firebase";

const colors = {
  anger: {
    background: "#DB5A42",
    foreground: "rgb(255, 214, 116)",
  },
  disgust: {
    background: "#499F68",
    foreground: "rgb(25, 43, 187)",
  },
  fear: {
    background: "#2E294E",
    foreground: "rgb(255, 236, 132)",
  },
  joy: {
    background: "#FFD275",
    foreground: "rgb(179, 24, 24)",
  },
  sadness: {
    background: "#19647E",
    foreground: "rgb(255, 236, 132)",
  },
};

const getCategories = (posts, level) => {
  let cats = {};
  for (let post_index in posts) {
    let post = posts[post_index];

    if (!post["level" + level]) return cats;
    if (!cats[post["level" + level]]) cats[post["level" + level]] = {};
  }
  return cats;
};

// This method returns an array of bubble information,
// each bubble is a JSON object with the following structure:
//
// {
//      id:number,
//      title:string,
//      color: {
//          background:hex string,
//          foreground:hex string
//      }
// }
export const useBubbles = (category = "") => {
  const [catBubbles, setCatBubbles] = useState([]);
  const [current, setCurrent] = useState(catBubbles);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ load, setLoad] = useState(true);

  useEffect(() => {

    if (!load) return

    setLoad(false)
    const categories = category.split("/");
    let levels = {};
    let count = 1;
    for (let category_index in categories) {
      const category = categories[category_index];
      if (category === "") break;
      levels["level" + count++] = category.replaceAll("_", " ");
    }
    setLoading(true);

    queryPostsByLevels(levels).then((results) => {
      setLoading(false);
      setPosts(
        results.map((post) => ({
          ...post,
          color: post.nlu_analysis
            ? colors[
                Object.keys(
                  post.nlu_analysis.result.emotion.document.emotion
                ).reduce(
                  (prev, name) => {
                    const value =
                      post.nlu_analysis.result.emotion.document.emotion[name];
                    if (value > prev.value)
                      return {
                        value: value,
                        name: name,
                      };

                    return prev;
                  },
                  { value: 0, name: "fear" }
                ).name
              ]
            : colors.fear,
        }))
      );

    
      if (results.length === 0) {
        setCatBubbles([]);
        return;
      }
      let cats = getCategories(results, Object.keys(levels).length + 1);

      const mapCategories = (key) => {
        return {
          category: true,
          title: key,
          pid: key,
          color: {
            background:"rgb(10, 129, 107)",
            foreground:"rgb(8, 12, 11)"
          }
        };
      };

      let new_cats = Object.keys(cats).map(mapCategories);
      setCatBubbles(new_cats);
    });
  }, [category, load, posts]);

  useEffect(() => {
    if (!catBubbles) return;
    const path = category.split("/");
    let curr = catBubbles;

    for (let section_index in path) {
      let section = path[section_index];
      let new_curr = curr.find((cat) => cat.id === section);
      if (!new_curr || !new_curr.subcategories) break;
      curr = new_curr;
      curr = curr.subcategories;
    }

    setCurrent(curr);
  }, [catBubbles, category]);

  return {
    categories: current,
    audios: posts,
    loading,
  };
};

// This method returns an JSON object for a specific audio,
// with the following structure:
//
// {
//      title:string,
//      src:string,
//      transcript:string
// }
export const useAudio = (id) => {
  const [audio, setAudio] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    queryPostByPid(id).then((post) => {
      if (post.length === 0) return;
      setAudio(post[0]);
      setLoading(false);
    });
  }, [id]);

  return {
    audio,
    loading,
  };
};

// This method returns an array of comment, each comment is
// a JSON object with the following structure:
//
//   {
//     userId: string,
//     comId: string,
//     fullName: string,
//     avatarUrl: string,
//     text: string,
//     replies: null | [
//       {
//         userId: string,
//         comId: string,
//         fullName: string,
//         avatarUrl: string,
//         text: string
//       },
//       ...
//     ],
//   },
export const useComments = (id) => {
  const [comments, setComments] = useState([]);
  const [refresh, setRefresh] = useState(true);

  useEffect(() => {
    if (!refresh) return;

    setRefresh(false);
    queryCommentsByPid(id).then((results) => {
      const mapComment = (comment) => ({
        ...comment,
        replies: results
          .filter((com) => com.parentId === comment.comId)
          .map(mapComment),
      });

      let all_comments = results
        .filter((comment) => !comment.parentId)
        .map(mapComment);

      setComments(all_comments);
    });
  }, [id, refresh]);

  const newComment = (comment, parentId = null) => {
    addComment(id, comment, parentId).then((results) => {
      setRefresh(true);
    });
  };

  return {
    comments,
    newComment,
  };
};
