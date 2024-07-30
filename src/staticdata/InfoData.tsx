// format IMPORTANT !!! breaking white spaces

const InfoData: { id: number; type: string; info: string }[] = [
  {
    id: 1,
    type: "forYou",
    info: "For you is curated with posts from favorite categories and users you follow.",
  },
  {
    id: 2,
    type: "createPost",
    info: "Jot focuses on short reads. Posts are limited to 500 words.",
  },
  {
    id: 3,
    type: "username",
    info: "Your username cannot be changed after account creation.",
  },
  {
    id: 4,
    type: "privateProfile",
    info: `When your profile is set to private, users will not be able to see your followers, following, bio, favorite categories, or your top comments unless you allow them to follow you. 

Users will still be able to see your posts.`,
  },
  {
    id: 5,
    type: "contactUsButton",
    info: "Double check all required fields",
  },
];

export default InfoData;
