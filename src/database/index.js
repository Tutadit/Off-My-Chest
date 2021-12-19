import { categories } from "./categories";
import { queryPostsByLevels } from "./firebase";

const colors = [
  {
    // Yellow
    background: "#FFD275",
    foreground: "rgb(7, 17, 46)",
  },
  {
    // Red
    background: "#DB5A42",
    foreground: "rgb(255, 214, 116)",
  },
  {
    //Green
    background: "#499F68",
    foreground: "rgb(4, 6, 37)",
  },
  {
    // Pink
    background: "#F26DF9",
    foreground: "rgb(18, 36, 104)",
  },
  {
    // Orange
    background: "#EE964B",
    foreground: "rgb(68, 4, 4)",
  },
  {
    //Blue
    background: "#19647E",
    foreground: "rgb(255, 236, 132)",
  },
];

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
export const getBubbles = (category = "") => {
  if (category === "")
    return shuffle([
      ...categories.map((cat) => ({
        ...cat,
        subcategories: null,
      })),
    ]);
  const path = category.split("/");
  let current = categories;
  for (let section_index in path) {
    let section = path[section_index];
    current = current.find((cat) => cat.id === section);
    if (!current || !current.subcategories) return shuffle(getAudios(category));
    current = current.subcategories;
  }

  return shuffle([...current, ...getAudios(category)]);
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
export const getAudio = (id) => {
  return {
    title: "The title of the audio #" + id,
    src: "/audio.wav",
    transcript: "So this one day I went to lunch and stole a coookie",
  };
};

export const getAudios = (category) => {

  const categories = category.split("/");  
  const levels = {}
  let count = 1
  for(let category_index in categories) {
    const category = categories[category_index]
    levels['level'+count++] = category.replaceAll("_"," ")
  }

  queryPostsByLevels().then((audios) => {
    console.log(audios);
  });

  return [...Array(100).keys()].map((i) => ({
    id: i,
    title: "A proper title, not too long " + i,
    color: colors[i % colors.length],
    src: "/audio.wav",
  }));
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
