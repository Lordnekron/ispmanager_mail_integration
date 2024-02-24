const fs = require("fs");
const util = require("util");

const writeFileAsync = util.promisify(fs.writeFile);

async function findMails() {
  const regex = /pk\.[^\d@]+@/;
  const data = await takeAllMails();

  const findMails = data
    .filter((item) => regex.test(item.name) && item.forward === undefined)
    .map((item) => item.name);

  //await deleteMails(findMails);

  const outputPath = "filtered_mails.txt";
  console.log(findMails);
  await writeFileAsync(outputPath, findMails.join("\n"));
}
findMails();
