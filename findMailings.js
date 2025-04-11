const fs = require("fs");
const { instance, baseUrl } = require("./urls.js");
const util = require("util");

const writeFileAsync = util.promisify(fs.writeFile);

async function takeAllMails() {
  try {
    const response = await instance.get(`${baseUrl}&func=email`);
    const data = response.data;

    return data;
  } catch (error) {
    console.log("Ошибка ", error);
    throw error;
  }
}

async function findMailings() {
  const data = await takeAllMails();

  const findMails = data
    .filter((item) => item.dontsave === "on")
    .map((item) => item.name);

  //await deleteMails(findMails);

  const outputPath = "finded_mailings.txt";
  console.log(findMails);
  await writeFileAsync(outputPath, findMails.join("\n"));
}
findMailings();
