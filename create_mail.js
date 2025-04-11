const { instance, baseUrl, elma } = require("./urls.js");

let cities = [
  "astana",
  "atyrau",
  "karaganda",
  "pavlodar",
  "semey",
  "shymkent",
  "taldykorgan",
  "taraz",
  "vko",
  "kostanay",
  "taraz",
  "uralsk",
  "almaty",
  "aktobe",
  "kokshetau",
  "aktau",
  "turkestan",
  "kaskelen",
  "sko",
  "kyzylorda",
];
let common = ["pk.all", "pk.franchisee"];

async function getMail(mail) {
  try {
    const response = await instance.get(
      `${baseUrl}&func=email.edit&elid=${mail}`
    );
    const data = response.data;

    return data;
  } catch (error) {
    console.log("Ошибка ", error);
    throw error; // Проброс ошибки вверх по стеку вызовов
  }
}

async function onInit() {
  const raw = JSON.stringify({
    size: 10000,
  });
  const elmaPK = await elma.post("/production/pk_dictionary/list", raw);
  const data = elmaPK.data.result.result;

  const filteredElmaEmails = data.filter(
    (f) =>
      f.email && f.email.some((element) => element.email === notFindMails[item])
  );

  const regex = /^(pk-|fr-)/i;

  if (
    filteredElmaEmails.length > 0 &&
    filteredElmaEmails[0].city &&
    filteredElmaEmails[0].email &&
    (typeof filteredElmaEmails[0].pk_lis_code === "string"
      ? filteredElmaEmails[0].pk_lis_code.match(regex)
      : false)
  ) {
    const emailsToCheck = filteredElmaEmails[0].email.map((f) => f.email); // Получаем массив email
    const emailExists = emailsToCheck.some((item) => {
      return notFindMailsInfo.some((info) => info.email.includes(item));
    });

    if (!emailExists) {
      let lisCodeInfo = filteredElmaEmails[0].pk_lis_code.split("-");

      notFindMailsInfo.push({
        olymp: lisCodeInfo[0] === "pk",
        city: lisCodeInfo[lisCodeInfo[1] === "div" ? 2 : 1],
        email: emailsToCheck,
      });

      // Удаляем элемент из notFindMails
      notFindMails.splice(notFindMails.indexOf(notFindMails[item]), 1);
    } else {
      // Если email существует, удаляем элемент
      notFindMails.splice(notFindMails.indexOf(notFindMails[item]), 1);
    }
  }
}

async function checkElmaPK() {
  pkInfo = [];
  let lisCodeInfo;
  const raw = JSON.stringify({
    active: true,
    size: 1000,
    frch: true,
    filter: {
      tf: {
        __status: [1],
        aktivno: true,
      },
    },
  });
  const elmaPK = await elma.post("/production/pk_dictionary/list", raw);
  const data = elmaPK.data.result.result;

  for (let pk of data) {
    if (pk.pk_lis_code) {
      lisCodeInfo = pk.pk_lis_code.split("-");
    }

    const olymp = lisCodeInfo[0];
    const city =
      lisCodeInfo[lisCodeInfo[1] === "div" || lisCodeInfo[1] === "mc" ? 2 : 1];
    const emails = pk.email.map((f) => f.email);

    // Если нет записи для olymp, создаем её
    if (!pkInfo[olymp]) {
      pkInfo[olymp] = {};
    }

    // Если нет записи для города в текущем olymp, создаем её
    if (!pkInfo[olymp][city]) {
      pkInfo[olymp][city] = [];
    }

    // Добавляем emails в массив города, избегая дублирования
    pkInfo[olymp][city].push(...emails);
  }

  console.log(pkInfo);
}

//onInit();
checkElmaPK();
