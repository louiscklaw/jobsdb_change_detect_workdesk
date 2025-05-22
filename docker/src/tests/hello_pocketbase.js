const PocketBase = require('pocketbase/cjs');

const pb = new PocketBase('http://192.168.10.21:8195');

const data = {
  hlsUrl: 'test',
  video_title: 'test',
  video_actress: 'test',
  field: 'test',
  video_tags: 'JSON',
};

(async () => {
  const record = await pb.collection('download_list').create(data);
})();
