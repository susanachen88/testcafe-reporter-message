const simpleGit = require('simple-git/promise')();

async function createGitTag(tagName, commitSHA, tagMessage) {
  try {
    await simpleGit.tag(['-a', tagName, '-m', tagMessage, commitSHA]);
    console.log(`Tag '${tagName}' created successfully.`);
  } catch (error) {
    console.error('Error creating tag:', error);
  }
}

const tagName = 'v1.0.0';
const commitSHA = '640b96ae10bb3800ae9a8ed9beacac762e146dab';
const tagMessage = 'Initial release';

createGitTag(tagName, commitSHA, tagMessage);