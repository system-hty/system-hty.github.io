const fs = require('fs');
const path = require('path');

exports.handler = async (event, context) => {
  try {
    // 读取评论数据
    const dataPath = path.join(process.cwd(), 'data', 'comments.json');
    let comments = [];
    
    if (fs.existsSync(dataPath)) {
      const data = fs.readFileSync(dataPath, 'utf8');
      comments = JSON.parse(data);
    }
    
    return {
      statusCode: 200,
      body: JSON.stringify(comments)
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: '读取评论失败' })
    };
  }
};