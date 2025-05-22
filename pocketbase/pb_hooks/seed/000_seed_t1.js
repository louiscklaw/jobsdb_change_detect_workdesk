const config = require("/pb_hooks/seed/config.js");
const utils = require("/pb_hooks/seed/utils.js");

module.exports = ($app) => {
  const { CR_cat_id_news, CR_cat_id_technology } = config;
  const { getId, getAsset, dirtyTruncateTable } = utils;
  // const ASSETS_DIR = "/pb_hooks/assets";
  // const getAsset = (name) => $filesystem.fileFromPath(ASSETS_DIR + "/" + name);

  for (let i = 0; i < 3; i++) {
    let t1_collection = $app.findCollectionByNameOrId("t1");

    let record = new Record(t1_collection);
    record.set("hello", "world");
    let test_png = getAsset("1.png");
    record.set("test_file", test_png);

    $app.save(record);
  }
};
