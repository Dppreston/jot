express = require("express");
schemas = require("../schemas/schemas.ts");
let postsRouter = express.Router();
let cloudinary = require("cloudinary").v2;

//post GET

postsRouter.get("/jot-posts", async (req, res) => {
  const posts = schemas.JotPosts;

  // queries
  const {
    userId,
    sortOption,
    homeCategory,
    categorySelection,
    fullPopular,
    justForYou,
    titles,
    loadPosts,
    inView,
    length,
    forYouTransfer,
    loaderCheck,
    selectedCategory,
    allSelection,
    userSelection,
    savedFetch,
    postFinal,
    likedPosts,
    dislikedPosts,
    likes,
    postId,
    dislikes,
    specificUserLoader,
    currentCategory,
    userLoader,
    userLength,
    specificUserPosts,
    categorySort,
    userTopPosts,
    userTileTotalLikes,
    userTileTotalDislikes,
    commentCountFetch,
    posterId,
    dislikeUserCheck,
    likeUserCheck,
    otherPosts,
    postSearch,
    searchQuery,
    loadMorePosts,
    postDynamicLength,
    searchAllPopular,
    followers,
    fetchPostImg,
    postImgId,
    guestLoadPosts,
    guestLoaderCheck,
    reportPostData,
  } = req.query;

  //MAIN CATEGORIES / SORT

  if (
    homeCategory &&
    categorySelection != "just for you" &&
    categorySelection != "popular"
  ) {
    if (sortOption == 1) {
      const postData = await posts
        .find({ category: categorySelection })
        .limit(4)
        .sort({ likes: -1 })
        .exec();

      if (postData) {
        return res.send(JSON.stringify(postData));
      }
    }
    if (sortOption == 2) {
      const postData = await posts
        .find({ category: categorySelection })
        .sort({ dislikes: -1 })
        .limit(4)
        .exec();
      if (postData) {
        return res.send(JSON.stringify(postData));
      }
    }
    if (sortOption == 3) {
      const postData = await posts
        .find({ category: categorySelection })
        .sort({ creationDate: -1 })
        .limit(4)
        .exec();
      if (postData) {
        return res.send(JSON.stringify(postData));
      }
    }
    if (sortOption == 4) {
      const postData = await posts
        .find({ category: categorySelection })
        .sort({ creationDate: 1 })
        .limit(4)
        .exec();
      if (postData) {
        return res.send(JSON.stringify(postData));
      }
    }
    res.end();
  }

  //POPULAR SELECTION / SORT

  if (
    homeCategory &&
    categorySelection != "just for you" &&
    categorySelection == "popular"
  ) {
    if (sortOption == 1) {
      const postData = await posts
        .find({})
        .sort({ likes: -1, commentCount: -1 })
        .limit(4)
        .exec();
      if (postData) {
        return res.send(JSON.stringify(postData));
      }
    }
    if (sortOption == 2) {
      const postData = await posts
        .find({})
        .sort({ dislikes: -1 })
        .limit(4)
        .exec();
      if (postData) {
        return res.send(JSON.stringify(postData));
      }
    }
    if (sortOption == 3) {
      const postData = await posts
        .find({})
        .sort({ creationDate: -1 })
        .limit(4)
        .exec();
      if (postData) {
        return res.send(JSON.stringify(postData));
      }
    }
    if (sortOption == 4) {
      const postData = await posts
        .find({})
        .sort({ creationDate: 1 })
        .limit(4)
        .exec();
      if (postData) {
        return res.send(JSON.stringify(postData));
      }
    }
    res.end();
  }

  // JUST FOR YOU SELECTION // SORT

  let finalData = new Array();

  if (justForYou) {
    if (sortOption == 1) {
      const favTitlesArray = titles.split(",");
      const followersArray = followers.split(",");

      //favorite categories fetch

      for (let i = 0; i < favTitlesArray.length; i++) {
        const complete = await posts
          .find({ category: favTitlesArray[i] })
          .exec();
        if (complete) {
          complete.map((test) => {
            finalData.push(test);
          });
        }
      }

      //followers posts fetch

      for (let i = 0; i < followersArray.length; i++) {
        const complete = await posts.find({ userId: followersArray[i] }).exec();
        if (complete) {
          complete.map((test) => {
            finalData.push(test);
          });
        }
      }

      //removing duplicates

      finalData = finalData.filter(
        (data, index, self) =>
          index === self.findIndex((t) => t.title === data.title)
      );

      return res.send(
        JSON.stringify([
          ...finalData.sort(({ likes: a }, { likes: b }) => b - a).slice(0, 4),
        ])
      );
    }
    if (sortOption == 2) {
      const favTitlesArray = titles.split(",");
      const followersArray = followers.split(",");
      for (let i = 0; i < favTitlesArray.length; i++) {
        const complete = await posts
          .find({ category: favTitlesArray[i] })
          .exec();
        if (complete) {
          complete.map((test) => {
            finalData.push(test);
          });
        }
      }

      //followers posts fetch

      for (let i = 0; i < followersArray.length; i++) {
        const complete = await posts.find({ userId: followersArray[i] }).exec();
        if (complete) {
          complete.map((test) => {
            finalData.push(test);
          });
        }
      }

      //removing duplicates

      finalData = finalData.filter(
        (data, index, self) =>
          index === self.findIndex((t) => t.title === data.title)
      );
      return res.send(
        JSON.stringify([
          ...finalData
            .sort(({ dislikes: a }, { dislikes: b }) => b - a)
            .slice(0, 4),
        ])
      );
    }
    if (sortOption == 3) {
      const favTitlesArray = titles.split(",");
      const followersArray = followers.split(",");
      for (let i = 0; i < favTitlesArray.length; i++) {
        const complete = await posts
          .find({ category: favTitlesArray[i] })
          .exec();
        if (complete) {
          complete.map((test) => {
            finalData.push(test);
          });
        }
      }
      //followers posts fetch

      for (let i = 0; i < followersArray.length; i++) {
        const complete = await posts.find({ userId: followersArray[i] }).exec();
        if (complete) {
          complete.map((test) => {
            finalData.push(test);
          });
        }
      }

      //removing duplicates

      finalData = finalData.filter(
        (data, index, self) =>
          index === self.findIndex((t) => t.title === data.title)
      );
      return res.send(
        JSON.stringify([
          ...finalData
            .sort(({ creationDate: a }, { creationDate: b }) => b - a)
            .slice(0, 4),
        ])
      );
    }
    if (sortOption == 4) {
      const favTitlesArray = titles.split(",");
      const followersArray = followers.split(",");
      for (let i = 0; i < favTitlesArray.length; i++) {
        const complete = await posts
          .find({ category: favTitlesArray[i] })
          .exec();
        if (complete) {
          complete.map((test) => {
            finalData.push(test);
          });
        }
      }
      //followers posts fetch

      for (let i = 0; i < followersArray.length; i++) {
        const complete = await posts.find({ userId: followersArray[i] }).exec();
        if (complete) {
          complete.map((test) => {
            finalData.push(test);
          });
        }
      }

      //removing duplicates

      finalData = finalData.filter(
        (data, index, self) =>
          index === self.findIndex((t) => t.title === data.title)
      );
      return res.send(
        JSON.stringify([
          ...finalData
            .sort(({ creationDate: a }, { creationDate: b }) => b + a)
            .slice(0, 4),
        ])
      );
    }
    res.end();
  }

  //DYNAMIC LOADING ...

  // dynamic loading ALL OTHER CATEGORIES

  if (
    loadPosts &&
    categorySelection != "popular" &&
    categorySelection != "just for you"
  ) {
    const postData = await posts.find({ category: categorySelection }).exec();
    if (sortOption == 1) {
      if (inView == "true" && parseInt(length) <= postData.length) {
        const postData = await posts
          .find({ category: categorySelection })
          .sort({ likes: -1 })
          .limit(parseInt(length) + 4)
          .exec();
        if (postData) {
          return res.send(JSON.stringify(postData));
        }
      }
    }
    if (sortOption == 2) {
      if (inView == "true" && parseInt(length) <= postData.length) {
        const postData = await posts
          .find({ category: categorySelection })
          .sort({ dislikes: -1 })
          .limit(parseInt(length) + 4)
          .exec();
        if (postData) {
          return res.send(JSON.stringify(postData));
        }
      }
    }
    if (sortOption == 3) {
      if (inView == "true" && parseInt(length) <= postData.length) {
        const postData = await posts
          .find({ category: categorySelection })
          .sort({ creationDate: -1 })
          .limit(parseInt(length) + 4)
          .exec();
        if (postData) {
          return res.send(JSON.stringify(postData));
        }
      }
    }
    if (sortOption == 4) {
      if (inView == "true" && parseInt(length) <= postData.length) {
        const postData = await posts
          .find({ category: categorySelection })
          .sort({ creationDate: 1 })
          .limit(parseInt(length) + 4)
          .exec();
        if (postData) {
          return res.send(JSON.stringify(postData));
        }
      }
    }
    res.end();
  }

  //guest dynamic loading ALL OTHER CATEGORIES

  if (
    guestLoadPosts &&
    categorySelection != "popular" &&
    categorySelection != "just for you"
  ) {
    const postData = await posts.find({ category: categorySelection }).exec();
    if (sortOption == 1) {
      if (inView == "true" && parseInt(length) <= postData.length) {
        const postData = await posts
          .find({ category: categorySelection })
          .sort({ likes: -1 })
          .limit(parseInt(length) + 4)
          .exec();
        if (postData) {
          return res.send(JSON.stringify(postData));
        }
      }
    }
    if (sortOption == 2) {
      if (inView == "true" && parseInt(length) <= postData.length) {
        const postData = await posts
          .find({ category: categorySelection })
          .sort({ dislikes: -1 })
          .limit(parseInt(length) + 4)
          .exec();
        if (postData) {
          return res.send(JSON.stringify(postData));
        }
      }
    }
    if (sortOption == 3) {
      if (inView == "true" && parseInt(length) <= postData.length) {
        const postData = await posts
          .find({ category: categorySelection })
          .sort({ creationDate: -1 })
          .limit(parseInt(length) + 4)
          .exec();
        if (postData) {
          return res.send(JSON.stringify(postData));
        }
      }
    }
    if (sortOption == 4) {
      if (inView == "true" && parseInt(length) <= postData.length) {
        const postData = await posts
          .find({ category: categorySelection })
          .sort({ creationDate: 1 })
          .limit(parseInt(length) + 4)
          .exec();
        if (postData) {
          return res.send(JSON.stringify(postData));
        }
      }
    }
    res.end();
  }

  //dynamic loading JUST FOR YOU ONLY

  if (
    loadPosts &&
    categorySelection != "popular" &&
    categorySelection == "just for you"
  ) {
    if (sortOption == 1) {
      let finalData = new Array();
      const favTitlesArray = forYouTransfer.split(",");
      const followersArray = followers.split(",");

      for (let i = 0; i < favTitlesArray.length; i++) {
        const complete = await posts
          .find({ category: favTitlesArray[i] })
          .exec();
        if (complete) {
          complete.map((test) => {
            finalData.push(test);
          });
        }
      }

      //followers posts fetch

      for (let i = 0; i < followersArray.length; i++) {
        const complete = await posts.find({ userId: followersArray[i] }).exec();
        if (complete) {
          complete.map((test) => {
            finalData.push(test);
          });
        }
      }

      //removing duplicates

      finalData = finalData.filter(
        (data, index, self) =>
          index === self.findIndex((t) => t.title === data.title)
      );

      if (inView == "true" && parseInt(length) <= finalData.length) {
        return res.send(
          JSON.stringify([
            ...finalData
              .sort(({ likes: a }, { likes: b }) => b - a)
              .slice(0, parseInt(length) + 4),
          ])
        );
      }
    }
    if (sortOption == 2) {
      let finalData = new Array();
      const favTitlesArray = forYouTransfer.split(",");
      const followersArray = followers.split(",");

      for (let i = 0; i < favTitlesArray.length; i++) {
        const complete = await posts
          .find({ category: favTitlesArray[i] })
          .exec();
        if (complete) {
          complete.map((test) => {
            finalData.push(test);
          });
        }
      }
      //followers posts fetch

      for (let i = 0; i < followersArray.length; i++) {
        const complete = await posts.find({ userId: followersArray[i] }).exec();
        if (complete) {
          complete.map((test) => {
            finalData.push(test);
          });
        }
      }

      //removing duplicates

      finalData = finalData.filter(
        (data, index, self) =>
          index === self.findIndex((t) => t.title === data.title)
      );

      if (inView == "true" && parseInt(length) <= finalData.length) {
        return res.send(
          JSON.stringify([
            ...finalData
              .sort(({ dislikes: a }, { dislikes: b }) => b - a)
              .slice(0, parseInt(length) + 4),
          ])
        );
      }
    }
    if (sortOption == 3) {
      let finalData = new Array();
      const favTitlesArray = forYouTransfer.split(",");
      const followersArray = followers.split(",");

      for (let i = 0; i < favTitlesArray.length; i++) {
        const complete = await posts
          .find({ category: favTitlesArray[i] })
          .exec();
        if (complete) {
          complete.map((test) => {
            finalData.push(test);
          });
        }
      }
      //followers posts fetch

      for (let i = 0; i < followersArray.length; i++) {
        const complete = await posts.find({ userId: followersArray[i] }).exec();
        if (complete) {
          complete.map((test) => {
            finalData.push(test);
          });
        }
      }

      //removing duplicates

      finalData = finalData.filter(
        (data, index, self) =>
          index === self.findIndex((t) => t.title === data.title)
      );

      if (inView == "true" && parseInt(length) <= finalData.length) {
        return res.send(
          JSON.stringify([
            ...finalData
              .sort(({ likes: a }, { likes: b }) => b - a)
              .slice(0, parseInt(length) + 4),
          ])
        );
      }

      if (inView == "true" && parseInt(length) <= finalData.length) {
        return res.send(
          JSON.stringify([
            ...finalData
              .sort(({ creationDate: a }, { creationDate: b }) => b - a)
              .slice(0, parseInt(length) + 4),
          ])
        );
      }
    }
    if (sortOption == 4) {
      let finalData = new Array();
      const favTitlesArray = forYouTransfer.split(",");
      const followersArray = followers.split(",");

      for (let i = 0; i < favTitlesArray.length; i++) {
        const complete = await posts
          .find({ category: favTitlesArray[i] })
          .exec();
        if (complete) {
          complete.map((test) => {
            finalData.push(test);
          });
        }
      }

      //followers posts fetch

      for (let i = 0; i < followersArray.length; i++) {
        const complete = await posts.find({ userId: followersArray[i] }).exec();
        if (complete) {
          complete.map((test) => {
            finalData.push(test);
          });
        }
      }

      //removing duplicates

      finalData = finalData.filter(
        (data, index, self) =>
          index === self.findIndex((t) => t.title === data.title)
      );

      if (inView == "true" && parseInt(length) <= finalData.length) {
        return res.send(
          JSON.stringify([
            ...finalData
              .sort(({ likes: a }, { likes: b }) => b - a)
              .slice(0, parseInt(length) + 4),
          ])
        );
      }

      if (inView == "true" && parseInt(length) <= finalData.length) {
        return res.send(
          JSON.stringify([
            ...finalData
              .sort(({ creationDate: a }, { creationDate: b }) => b + a)
              .slice(0, parseInt(length) + 4),
          ])
        );
      }
    }
    res.end();
  }

  //dynamic loading POPULAR ONLY

  if (
    loadPosts &&
    categorySelection == "popular" &&
    categorySelection != "just for you"
  ) {
    const postData = await posts.find({}).exec();
    if (sortOption == 1) {
      if (inView == "true" && parseInt(length) <= postData.length) {
        const postData = await posts
          .find({})
          .sort({ likes: -1 })
          .limit(parseInt(length) + 4)
          .exec();
        if (postData) {
          return res.send(JSON.stringify(postData));
        }
      }
    }
    if (sortOption == 2) {
      if (inView == "true" && parseInt(length) <= postData.length) {
        const postData = await posts
          .find({})
          .sort({ dislikes: -1 })
          .limit(parseInt(length) + 4)
          .exec();
        if (postData) {
          return res.send(JSON.stringify(postData));
        }
      }
    }
    if (sortOption == 3) {
      if (inView == "true" && parseInt(length) <= postData.length) {
        const postData = await posts
          .find({})
          .sort({ creationDate: -1 })
          .limit(parseInt(length) + 4)
          .exec();
        if (postData) {
          return res.send(JSON.stringify(postData));
        }
      }
    }
    if (sortOption == 4) {
      if (inView == "true" && parseInt(length) <= postData.length) {
        const postData = await posts
          .find({})
          .sort({ creationDate: 1 })
          .limit(parseInt(length) + 4)
          .exec();
        if (postData) {
          return res.send(JSON.stringify(postData));
        }
      }
    }
    res.end();
  }

  //dynamic loading POPULAR ONLY GUEST

  if (
    guestLoadPosts &&
    categorySelection == "popular" &&
    categorySelection != "just for you"
  ) {
    const postData = await posts.find({}).exec();
    if (sortOption == 1) {
      if (inView == "true" && parseInt(length) <= postData.length) {
        const postData = await posts
          .find({})
          .sort({ likes: -1 })
          .limit(parseInt(length) + 4)
          .exec();
        if (postData) {
          return res.send(JSON.stringify(postData));
        }
      }
    }
    if (sortOption == 2) {
      if (inView == "true" && parseInt(length) <= postData.length) {
        const postData = await posts
          .find({})
          .sort({ dislikes: -1 })
          .limit(parseInt(length) + 4)
          .exec();
        if (postData) {
          return res.send(JSON.stringify(postData));
        }
      }
    }
    if (sortOption == 3) {
      if (inView == "true" && parseInt(length) <= postData.length) {
        const postData = await posts
          .find({})
          .sort({ creationDate: -1 })
          .limit(parseInt(length) + 4)
          .exec();
        if (postData) {
          return res.send(JSON.stringify(postData));
        }
      }
    }
    if (sortOption == 4) {
      if (inView == "true" && parseInt(length) <= postData.length) {
        const postData = await posts
          .find({})
          .sort({ creationDate: 1 })
          .limit(parseInt(length) + 4)
          .exec();
        if (postData) {
          return res.send(JSON.stringify(postData));
        }
      }
    }
    res.end();
  }

  //loader check all other categories

  if (
    loaderCheck &&
    selectedCategory != "just for you" &&
    selectedCategory != "popular"
  ) {
    const postData = await posts.find({ category: selectedCategory }).exec();
    if (postData) {
      return res.send(JSON.stringify(postData.length));
    }
    res.end();
  }

  // guest check all other categories

  if (
    guestLoaderCheck &&
    selectedCategory != "just for you" &&
    selectedCategory != "popular"
  ) {
    const postData = await posts.find({ category: selectedCategory }).exec();
    if (postData) {
      return res.send(JSON.stringify(postData.length));
    }
    res.end();
  }

  //loader check popular

  if (loaderCheck && selectedCategory == "popular") {
    const postData = await posts.find({}).exec();
    if (postData) {
      return res.send(JSON.stringify(postData.length));
    }
    res.end();
  }

  //guest loader check popular

  if (guestLoaderCheck && selectedCategory == "popular") {
    const postData = await posts.find({}).exec();
    if (postData) {
      return res.send(JSON.stringify(postData.length));
    }
    res.end();
  }

  //loader check just for you

  if (loaderCheck && selectedCategory == "just for you") {
    let finalData = new Array();
    const followersArray = followers.split(",");
    const favTitlesArray = forYouTransfer.split(",");

    for (let i = 0; i < favTitlesArray.length; i++) {
      const complete = await posts.find({ category: favTitlesArray[i] }).exec();
      if (complete) {
        complete.map((test) => {
          finalData.push(test);
        });
      }
    }

    //followers posts fetch

    for (let i = 0; i < followersArray.length; i++) {
      const complete = await posts.find({ userId: followersArray[i] }).exec();
      if (complete) {
        complete.map((test) => {
          finalData.push(test);
        });
      }
    }

    //removing duplicates

    finalData = finalData.filter(
      (data, index, self) =>
        index === self.findIndex((t) => t.title === data.title)
    );

    return res.send(JSON.stringify([...finalData].length));
  }

  //user post fetch LIMIT

  //full length user category fetch

  if (allSelection) {
    if (userSelection == 1) {
      const fullLength = await posts.find({ userId: userId }).exec();
      const postData = await posts
        .find({ userId: userId })
        .sort({ creationDate: -1 })
        .limit(4)
        .exec();
      if (postData) {
        return res.send(JSON.stringify([postData, fullLength]));
      }
    }

    if (userSelection == 2) {
      const allPosts = await posts.find({}).exec();
      const data = allPosts.filter((posts) =>
        posts.savedUsers.some((data) => data == userId)
      );

      if (data) {
        return res.send(JSON.stringify([data.slice(0, 4), data]));
      }
    }

    if (userSelection == 3) {
      const allPosts = await posts.find({}).exec();
      if (allPosts) {
        const data = allPosts.filter((posts) =>
          posts.likedUsers.some((data) => data == userId)
        );

        if (data) {
          return res.send(JSON.stringify([data.slice(0, 4), data]));
        }
      }
    }

    if (userSelection == 4) {
      const allPosts = await posts.find({}).exec();
      const data = allPosts.filter((posts) =>
        posts.dislikedUsers.some((data) => data == userId)
      );
      if (data) {
        return res.send(JSON.stringify([data.slice(0, 4), data]));
      }
    }
    res.end();
  }

  //USER DASHBOARD dynamic loading

  if (userLoader) {
    //all posts

    if (userSelection == 1 && inView == "true") {
      const load = await posts
        .find({ userId: userId })
        .sort({ creationDate: -1 })
        .limit(parseInt(userLength) + 4)
        .exec();
      if (load) {
        return res.send(JSON.stringify(load));
      }
      return;
    }

    //saved posts

    if (userSelection == 2 && inView == "true") {
      const allPosts = await posts.find({}).exec();
      const data = allPosts.filter((posts) =>
        posts.savedUsers.some((el) => el == userId)
      );

      if (data) {
        return res.send(
          JSON.stringify(data.slice(0, parseInt(userLength) + 4))
        );
      }
      return;
    }

    //liked posts

    if (userSelection == 3 && inView == "true") {
      const allPosts = await posts.find({}).exec();
      const data = allPosts.filter((posts) =>
        posts.likedUsers.some((el) => el == userId)
      );
      if (data) {
        return res.send(
          JSON.stringify(data.slice(0, parseInt(userLength) + 4))
        );
      }
      return;
    }

    //disliked posts

    if (userSelection == 4 && inView == "true") {
      const allPosts = await posts.find({}).exec();
      const data = allPosts.filter((posts) =>
        posts.dislikedUsers.some((el) => el == userId)
      );
      if (data) {
        return res.send(
          JSON.stringify(data.slice(0, parseInt(userLength) + 4))
        );
      }
      return;
    }
    res.end();
  }

  //SPECIFIC USER dynamic loading

  if (specificUserLoader && inView == "true") {
    // top
    if (sortOption == 1) {
      const load = await posts
        .find({ userId: userId })
        .sort({ likes: -1 })
        .limit(parseInt(userLength) + 4)
        .exec();

      if (currentCategory == "") {
        return res.send(JSON.stringify(load));
      } else {
        const loadFiltered = load.filter(
          (data) => data.category == currentCategory
        );
        return res.send(
          JSON.stringify(loadFiltered.slice(0, parseInt(userLength) + 6))
        );
      }
    }

    //low

    if (sortOption == 2) {
      const load = await posts
        .find({ userId: userId })
        .sort({ dislikes: -1 })
        .limit(parseInt(userLength) + 4)
        .exec();

      if (currentCategory == "") {
        return res.send(JSON.stringify(load));
      } else {
        const loadFiltered = load.filter(
          (data) => data.category == currentCategory
        );
        return res.send(
          JSON.stringify(loadFiltered.slice(0, parseInt(userLength) + 6))
        );
      }
    }

    //new

    if (sortOption == 3) {
      const load = await posts
        .find({ userId: userId })
        .sort({ creationDate: -1 })
        .limit(parseInt(userLength) + 4)
        .exec();

      if (currentCategory == "") {
        return res.send(JSON.stringify(load));
      } else {
        const loadFiltered = load.filter(
          (data) => data.category == currentCategory
        );
        return res.send(
          JSON.stringify(loadFiltered.slice(0, parseInt(userLength) + 6))
        );
      }
    }

    //old
    if (sortOption == 4) {
      const load = await posts
        .find({ userId: userId })
        .sort({ creationDate: 1 })
        .limit(parseInt(userLength) + 4)
        .exec();

      if (currentCategory == "") {
        return res.send(JSON.stringify(load));
      } else {
        const loadFiltered = load.filter(
          (data) => data.category == currentCategory
        );
        return res.send(
          JSON.stringify(loadFiltered.slice(0, parseInt(userLength) + 6))
        );
      }
    }
    res.end();
  }

  //fetch likes and dislikes

  if (likes) {
    const retrieveLikes = await posts.find({ _id: postId }).exec();
    if (retrieveLikes) {
      res.send(JSON.stringify(retrieveLikes));
    }
    res.end();
  }
  if (dislikes) {
    const retrieveLikes = await posts.find({ _id: postId }).exec();
    if (retrieveLikes) {
      res.send(JSON.stringify(retrieveLikes));
    }
    res.end();
  }

  //liked and disliked posts

  if (likedPosts) {
    const likedPostData = await posts
      .find({ likedUsers: userId })
      .limit(10)
      .exec();

    if (likedPostData) {
      return res.send(JSON.stringify(likedPostData));
    }
    res.end();
  }
  if (dislikedPosts) {
    const dislikedPostData = await posts
      .find({ dislikedUsers: userId })
      .limit(10)
      .exec();

    if (dislikedPostData) {
      return res.send(JSON.stringify(dislikedPostData));
    }
    res.end();
  }

  //selected post fetch

  if (postFinal) {
    const postData = await posts.find({});
    const findPost = postData.find((el) => el._id == postId);

    if (findPost != undefined) {
      return res.send(JSON.stringify([findPost]));
    } else {
      return res.send(JSON.stringify(null));
    }
  }

  //saved posts

  if (savedFetch) {
    const retrieveSaved = await posts
      .find({ savedUsers: userId })
      .limit(4)
      .exec();
    if (retrieveSaved) {
      return res.send(JSON.stringify(retrieveSaved));
    }
    res.end();
  }

  //post like check

  if (likeUserCheck) {
    const postCheck = await posts.find({ _id: postId }).exec();
    const liked = postCheck[0]?.likedUsers?.find((id) => id == userId);

    if (liked == undefined) {
      return res.send(false);
    } else {
      return res.send(true);
    }
  }

  if (dislikeUserCheck) {
    const postCheck = await posts.find({ _id: postId }).exec();
    const disliked = postCheck[0]?.dislikedUsers?.find((id) => id == userId);

    if (disliked == undefined) {
      return res.send(false);
    } else {
      return res.send(true);
    }
  }

  //userId Check for interctions

  if (posterId) {
    const postCheck = await posts.find({ _id: postId }).exec();
    const userCheck = postCheck[0]?.userId == userId;
    if (userCheck == true) {
      return res.send(true);
    } else {
      return res.send(false);
    }
  }

  if (commentCountFetch) {
    const commentCountFetch = await posts
      .find({ _id: postId }, { commentCount: 1 })
      .exec();
    if (commentCountFetch) {
      return res.send(JSON.stringify(commentCountFetch));
    }
    res.end();
  }

  //user tile total likes

  if (userTileTotalLikes) {
    const totalPosts = await posts.find({ userId: userId }).exec();

    if (totalPosts) {
      let sum = 0;
      const likeData = totalPosts.map((data) => data.likes);

      likeData.forEach((element) => (sum += element));
      return res.send([sum, totalPosts.length]);
    }
    res.end();
  }
  if (userTileTotalDislikes) {
    const totalPosts = await posts.find({ userId: userId }).exec();

    if (totalPosts) {
      let sum = 0;
      const dislikeData = totalPosts.map((data) => data.dislikes);

      dislikeData.forEach((element) => (sum += element));
      return res.send(JSON.stringify(sum));
    }
    res.end();
  }

  //user tile top posts

  if (userTopPosts) {
    const postData = await posts
      .find({ userId: userId })
      .sort({ likes: -1 })
      .limit(3)
      .exec();
    if (postData) {
      return res.send(JSON.stringify(postData));
    }
    res.end();
  }

  //specific user posts && sort

  if (specificUserPosts) {
    if (sortOption == 1) {
      const postData = await posts
        .find({ userId: userId })
        .limit(10)
        .sort({ likes: -1 })
        .exec();

      const foundPosts = postData
        .filter((el) => el.userId == userId)
        .slice(0, 10)
        .sort((a, b) => b.likes - a.likes);
      if (foundPosts.length != 0) {
        if (categorySort == "") {
          const fullPostData = await posts.find({ userId: userId }).exec();
          return res.send([foundPosts, fullPostData.length]);
        } else {
          const filteredData = foundPosts.filter(
            (data) => data.category == categorySort
          );
          return res.send([filteredData.slice(0, 10), filteredData.length]);
        }
      } else {
        return res.send(JSON.stringify(null));
      }
    }
    if (sortOption == 2) {
      const postData = await posts
        .find({ userId: userId })
        .limit(10)
        .sort({ dislikes: -1 })
        .exec();
      if (categorySort == "") {
        const fullPostData = await posts.find({ userId: userId }).exec();
        return res.send([postData, fullPostData.length]);
      } else {
        const filteredData = postData.filter(
          (data) => data.category == categorySort
        );
        return res.send([filteredData.slice(0, 10), filteredData.length]);
      }
    }
    if (sortOption == 3) {
      const postData = await posts
        .find({ userId: userId })
        .limit(10)
        .sort({ creationDate: -1 })
        .exec();
      if (categorySort == "") {
        const fullPostData = await posts.find({ userId: userId }).exec();
        return res.send([postData, fullPostData.length]);
      } else {
        const filteredData = postData.filter(
          (data) => data.category == categorySort
        );
        return res.send([filteredData.slice(0, 10), filteredData.length]);
      }
    }
    if (sortOption == 4) {
      const postData = await posts
        .find({ userId: userId })
        .limit(10)
        .sort({ creationDate: 1 })
        .exec();
      if (categorySort == "") {
        const fullPostData = await posts.find({ userId: userId }).exec();
        return res.send([postData, fullPostData.length]);
      } else {
        const filteredData = postData.filter(
          (data) => data.category == categorySort
        );
        return res.send([filteredData.slice(0, 10), filteredData.length]);
      }
    }
    res.end();
  }

  //other posts by user

  if (otherPosts) {
    const postData = await posts.find({ userId: userId }).limit(4).exec();
    if (postData) {
      return res.send(JSON.stringify(postData));
    }
    res.end();
  }

  // SEARCH

  //post search

  if (postSearch) {
    const postData = await posts
      .find({}, { title: 1, category: 1, userId: 1, postBody: 1, headline: 1 })
      .exec();
    const split = searchQuery.toLowerCase().split();

    const filtered = postData.filter((word) =>
      split.every(
        (char) =>
          word.title.toLowerCase().includes(char) ||
          word.category.toLowerCase().includes(char)
      )
    );

    if (filtered) {
      return res.send([filtered.slice(0, 3), filtered.length]);
    }
    res.end();
  }

  //search all popular

  if (searchAllPopular) {
    const postData = await posts.find({}).sort({ likes: -1 }).limit(4).exec();

    if (postData) {
      return res.send(JSON.stringify(postData));
    }
    res.end();
  }

  // load more posts

  if (loadMorePosts) {
    const postData = await posts
      .find({}, { title: 1, category: 1, userId: 1, postBody: 1, headline: 1 })
      .exec();
    const split = searchQuery.toLowerCase().split();

    const filtered = postData.filter((word) =>
      split.every(
        (char) =>
          word.title.toLowerCase().includes(char) ||
          word.category.toLowerCase().includes(char)
      )
    );

    if (filtered) {
      return res.send([
        filtered.slice(0, parseInt(postDynamicLength) + 6),
        filtered.length,
      ]);
    }
    res.end();
  }

  //fetch post img

  if (fetchPostImg) {
    const postImgData = cloudinary.url(postImgId);

    if (postImgData) {
      return res.send(postImgData);
    } else {
      return res.send(false);
    }
  }

  //fetch report info

  if (reportPostData) {
    const action = await posts
      .find({ _id: postId }, { title: 1, userId: 1 })
      .exec();
    if (action) {
      return res.send(JSON.stringify(action));
    } else {
      return res.send(false);
    }
  }
});

//posts POST

postsRouter.post("/jot-posts", async (req, res) => {
  // create post body

  const { category, title, postBody, headline, userId, postImg } = req.body;
  const { createPost } = req.query;

  if (createPost) {
    if (postImg != "") {
      cloudinary.uploader.upload(
        postImg,
        { public_id: Math.floor(Math.random() * 100000000), invalidate: true },
        async (err, result) => {
          const newPostData = {
            category: category,
            title: title,
            postBody: postBody,
            headline: headline,
            userId: userId,
            likes: 0,
            dislikes: 0,
            likedUsers: [],
            dislikedUsers: [],
            commentCount: 0,
            savedUsers: [],
            postImg: result.public_id,
            postImgVersion: result.version,
          };
          const newPost = new schemas.JotPosts(newPostData);
          const savePost = await newPost.save();

          if (savePost) {
            res.send(true);
          } else {
            return res.send(false);
          }
        }
      );
    } else {
      const newPostData = {
        category: category,
        title: title,
        postBody: postBody,
        headline: headline,
        userId: userId,
        likes: 0,
        dislikes: 0,
        likedUsers: [],
        dislikedUsers: [],
        commentCount: 0,
        savedUsers: [],
        postImg: null,
        postImgVersion: null,
      };
      const newPost = new schemas.JotPosts(newPostData);
      const savePost = await newPost.save();

      if (savePost) {
        res.send(true);
      } else {
        return res.send(false);
      }
    }
  }
});

//posts PUT

postsRouter.put("/jot-posts", async (req, res) => {
  const posts = schemas.JotPosts;

  //queries
  const {
    postLike,
    postDislike,
    postId,
    userId,
    updateCommentCount,
    addComment,
    deletePost,
    saveUserToPost,
    deletePostImg,
    postImg,
  } = req.query;

  //save user to post

  if (saveUserToPost) {
    const postFind = await posts.find({ _id: postId }).exec();
    const checkUserSaved = postFind[0]?.savedUsers.find((users) => {
      return users == userId;
    });

    if (checkUserSaved) {
      const removeSavedUser = await posts.updateOne(
        { _id: postId },
        {
          $pull: { savedUsers: userId },
        }
      );
      if (removeSavedUser) {
        return res.send(JSON.stringify("saved reomved from user"));
      }
    } else {
      const addSavedUser = await posts.updateOne(
        { _id: postId },
        {
          $push: { savedUsers: userId },
        }
      );
      if (addSavedUser) {
        return res.send(JSON.stringify("saved user added"));
      }
    }
    res.end();
  }

  //add post like // dislike

  if (postLike) {
    const postCheck = await posts.find({ _id: postId }).exec();
    const userCheck = postCheck[0]?.likedUsers.find((users) => {
      return users == userId;
    });

    if (postCheck[0].likedUsers.length <= 0 || !userCheck) {
      const addUserLike = await posts.updateOne(
        {
          _id: postId,
        },
        { $push: { likedUsers: userId }, $inc: { likes: 1 } }
      );
      if (addUserLike) {
        return res.send(true);
      }
      return res.end();
    }

    if (userCheck) {
      const removeUserLike = await posts.updateOne(
        { _id: postId },
        {
          $pull: {
            likedUsers: userId,
          },
          $inc: { likes: -1 },
        }
      );
      if (removeUserLike) {
        return res.send(false);
      }
      return res.end();
    }
    res.end();
  }

  if (postDislike) {
    const postCheck = await posts.find({ _id: postId }).exec();
    const dislikeUserCheck = postCheck[0]?.dislikedUsers.find((users) => {
      return users == userId;
    });

    if (postCheck[0].dislikedUsers.length <= 0 || !dislikeUserCheck) {
      const addUserDislike = await posts.updateOne(
        {
          _id: postId,
        },
        { $push: { dislikedUsers: userId }, $inc: { dislikes: 1 } }
      );
      if (addUserDislike) {
        return res.send(true);
      }
      return res.end();
    }

    if (dislikeUserCheck) {
      const removeUserDislike = await posts.updateOne(
        { _id: postId },
        {
          $pull: {
            dislikedUsers: userId,
          },
          $inc: { dislikes: -1 },
        }
      );
      if (removeUserDislike) {
        return res.send(false);
      }
      return res.end();
    }
    res.end();
  }

  //delete post

  if (deletePost) {
    const finalDelete = await posts.deleteOne({ _id: postId }).exec();
    if (finalDelete) {
      return res.send(JSON.stringify("deleted"));
    }
    res.end();
  }

  //add comment count

  if (addComment) {
    const addComment = await posts.updateOne(
      { _id: postId },
      {
        $inc: { commentCount: 1 },
      }
    );
    if (addComment) {
      return res.send(JSON.stringify("updated"));
    }
    res.end();
  }

  //decrease comment count

  if (updateCommentCount) {
    const decreaseCommentCount = await posts.updateOne(
      { _id: postId },
      {
        $inc: { commentCount: -1 },
      }
    );
    if (decreaseCommentCount) {
      return res.send(JSON.stringify("done"));
    }
    res.end();
  }

  //delete post Img

  if (deletePostImg) {
    cloudinary.uploader.destroy(postImg.toString());
  }
});

module.exports = postsRouter;
