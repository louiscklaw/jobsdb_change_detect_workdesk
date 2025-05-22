const config = require("/pb_hooks/seed/config.js");

module.exports = {
  getAsset: (name) => {
    const file_full_path = config.ASSETS_DIR + "/" + name;
    try {
      return $filesystem.fileFromPath(file_full_path);
    } catch (error) {
      console.log("file not found: " + file_full_path, +"please check if file exist");
    }
  },
  getId: (id) => id.padStart(15, 0),
  randomId: (max) =>
    Math.floor(Math.random() * max)
      .toString()
      .padStart(15, 0),

  dirtyTruncateTable: (COLLECTION_NAME) => {
    console.log(`perform dirty method to truncate table "${COLLECTION_NAME}"`);
    const cmd_to_exec = $os.cmd("sqlite3", "/pb_data/data.db", `DELETE from ${COLLECTION_NAME};`);
    cmd_to_exec.output();
  },
};
