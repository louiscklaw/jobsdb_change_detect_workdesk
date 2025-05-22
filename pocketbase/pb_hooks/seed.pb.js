/// <reference path="../pb_data/types.d.ts" />

$app.rootCmd.addCommand(
  new Command({
    use: "seed",
    run: (cmd, args) => {
      $app.importCollections(require(`${__hooks}/seed/schema.json`));

      // $app.reloadCachedCollections();
      // $app.reloadSettings();
      // console.log("reload table done");

      // console.log("start seeding data");
      // require(`${__hooks}/seed/000_seed_t1.js`)($app);
      // require(`${__hooks}/seed/001_seed_LessonsTypes.js`)($app);


      // $app.reloadCachedCollections();
      // $app.reloadSettings();
    },
  })
);
