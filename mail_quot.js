let mailArray = []; //массив для адресов
let maxsize = "40"; //старый размер ящиков
let newMaxsize = "70"; // новый размер ящиков

const { instance, baseUrl } = require("./urls.js");

async function getMailMaxSize(mail) {
  try {
    const response = await instance.get(
      `${baseUrl}&func=email.edit&elid=${mail}`
    );
    const data = response.data;
    if (data.maxsize === maxsize) {
      return mail;
    }
  } catch (error) {
    console.log("Ошибка ", error);
    throw error; // Проброс ошибки вверх по стеку вызовов
  }
}

async function changeMailsMaxSize(mailsArray) {
  mailsArray.map(async (item) => {
    await instance
      .get(
        `${baseUrl}&func=email.edit&elid=${item}&sok=ok&maxsize=${newMaxsize}`
      )
      .then((responce) => console.log(responce.data))
      .catch((error) => console.log("Ошибка ", error));
  });
}

async function getAllMailsMaxSize(mailArray) {
  let mailsMaxSize = [];

  for (let mail of mailArray) {
    let mailMaxSize = await getMailMaxSize(mail);
    console.log(await getMailMaxSize(mail));
    mailMaxSize ? mailsMaxSize.push(mailMaxSize) : "";
  }

  console.log("Найдены почты:", mailsMaxSize);

  if (mailsMaxSize.length > 0) {
    await changeMailsMaxSize(mailsMaxSize);
  } else {
    console.log(`Нет электронных адресов с maxsize = ${maxsize}`);
  }
}

getAllMailsMaxSize(mailArray);
