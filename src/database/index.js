import { useState, useEffect } from "react";

import { queryPostsByLevels, queryPostByPid } from "./firebase";

const colors = [
  {
    // Yellow
    background: "#FFD275",
    foreground: "rgb(179, 24, 24)",
  },
  {
    // Red
    background: "#DB5A42",
    foreground: "rgb(255, 214, 116)",
  },
  {
    //Green
    background: "#499F68",
    foreground: "rgb(25, 43, 187)",
  },
  {
    // Pink
    background: "#F26DF9",
    foreground: "rgb(25, 67, 77)",
  },
  {
    // Orange
    background: "#EE964B",
    foreground: "rgb(132, 25, 25)",
  },
  {
    //Blue
    background: "#19647E",
    foreground: "rgb(255, 236, 132)",
  },
];

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

  useEffect(() => {
    const categories = category.split("/");
    let levels = {};
    let count = 1;
    for (let category_index in categories) {
      const category = categories[category_index];
      if (category === "") break;
      levels["level" + count++] = category.replaceAll("_", " ");
    }

    queryPostsByLevels(levels).then((posts) => {
      setPosts(
        posts.map((post) => ({
          ...post,
          color: {
            background: "#EE964B",
            foreground: "#000000",
          },
        }))
      );
      if (posts.length === 0) {
        setCatBubbles([]);
        return;
      }
      console.log(posts);
      let cats = getCategories(posts, Object.keys(levels).length + 1);

      let curr = cats;
      const mapCategories = (key) => {
        curr = curr[key];
        return {
          category: true,
          title: key,
          id: key,
          color: {
            background: "#EE964B",
            foreground: "#000000",
          },
        };
      };

      let new_cats = Object.keys(cats).map(mapCategories);
      setCatBubbles(new_cats);
    });
  }, [category]);

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
  };
};

function shuffle(array) {
  let currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle...
  while (currentIndex !== 0) {
    // Pick a remaining element...
    randomIndex = Math.floor(0.9 * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}

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
  useEffect(() => {
    queryPostByPid(id).then((post) => {
      if(post.length === 0) return
      setAudio(post[0]);      
    });
  }, [id]);

  return audio;
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
export const getComments = (id) => {
  return [
    {
      userId: "01a",
      comId: "012",
      fullName: "Riya Negi",
      avatarUrl: "https://ui-avatars.com/api/name=Riya&background=random",
      text: "Hey, Loved your blog! ",
      replies: [
        {
          userId: "02a",
          comId: "013",

          fullName: "Adam Scott",
          avatarUrl: "https://ui-avatars.com/api/name=Adam&background=random",
          text: "Thanks! It took me 1 month to finish this project but I am glad it helped out someone!🥰",
        },
        {
          userId: "01a",
          comId: "014",

          fullName: "Riya Negi",
          avatarUrl: "https://ui-avatars.com/api/name=Riya&background=random",
          text: "thanks!😊",
        },
      ],
    },
    {
      userId: "02b",
      comId: "017",
      fullName: "Lily",
      text: "I have a doubt about the 4th point🤔",
      avatarUrl: "https://ui-avatars.com/api/name=Lily&background=random",
    },
    {
      userId: "01c",
      comId: "018",
      fullName: "Derek",
      text: "Great explanation!!!",
      avatarUrl: "https://ui-avatars.com/api/name=Derek&background=random",
    },
  ];
};
