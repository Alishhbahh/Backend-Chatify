const { rdb } = require('./config/firebase')
const admin = require('firebase-admin');
const { ref, query,get,child, remove} = require('firebase/database');

const deleteOldStories = async () => {
  console.log("Delete")
  const storiesRef = ref(rdb, 'stories');
  const cutoff = Date.now() - 24 * 60 * 60 * 1000; // 24 hours in milliseconds
  const storiesQuery = query(storiesRef);
  const snapshot = await get(storiesQuery);

  // Filter the old stories that are older than 24 hours
  const oldStories = [];
  snapshot.forEach((childSnapshot) => { 
    const childData = childSnapshot.val().stories; //gets stories of each user
    const key = childSnapshot.key;
    Object.keys(childData).forEach((index) => { //iterates each story in stories array
      const story = childData[index];
      const storyCreatedAt = new Date(story.createdAt).getTime();
      if (storyCreatedAt < cutoff) {
        oldStories.push({ key, index });
      }
    });
  });
  // Delete the old stories
  const promises = [];
  oldStories.forEach(async(story) => {
    const storyRef = ref(rdb, `stories/${story.key}/stories/${story.index}`);
    await remove(storyRef)
    //if the node has no stories left delete the entire node
    const childSnapshot = await get(child(storiesRef, story.key));
    const childData = childSnapshot.val();
    if (childData.stories == null || Object.keys(childData.stories).length == 0) {
      promises.push(remove(childSnapshot.ref));
    }
  });

  await Promise.all(promises);

}



module.exports= deleteOldStories;


  