const fs = require("fs");
const util = require("util");

const writeFileAsync = util.promisify(fs.writeFile);

async function takeAllMails() {
  try {
    let requestOptions = {
      method: "GET",
      redirect: "follow",
    };
    const response = await fetch(
      `https://mail.kdlolymp.kz:1500/ispmgr?authinfo=root:0blivi0n22v8_123!&out=JSONdata&func=email`,
      requestOptions
    );

    const data = await response.text();

    return JSON.parse(data); // Возвращаем данные, если нужно использовать их далее в коде
  } catch (error) {
    console.error("Ошибка ", error); // Выводим ошибку в консоль
    throw error; // Можно пробросить ошибку выше, если это необходимо
  }
}

async function deleteMails(mails) {
  for (let mail of mails) {
    let requestOptions = {
      method: "GET",
      redirect: "follow",
    };
    const response = await fetch(
      `https://mail.kdlolymp.kz:1500/ispmgr?authinfo=root:0blivi0n22v8_123!&out=JSONdata&func=email.delete&elid=${mail}`,
      requestOptions
    );
    const data = await response.text();
    console.log(data);
  }
}

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
