const { instance, baseUrl } = require("./urls.js");
const XLSX = require("xlsx");
let pathExcell = "./excell.xlsx";
let domain = "";

async function createMails(mail, fio, position) {
  let password = Math.random().toString(36).slice(-11);
  const description = `ФИО сотрудника: ${fio} Должность: ${position} Юр лицо: "AMG"`;
  await instance
    .get(
      `${baseUrl}&func=email.edit&sok=ok&name=${mail}
        &domainname=${domain}&passwd=${password}&maxsize=70&greylist=on&note=${description}`
    )
    .then((responce) => responce.data)
    .then((responce) =>
      !responce.error
        ? console.log(`${responce.id} пароль: ${password}`)
        : console.log(`${mail} have error: ${responce.error.code}`)
    )
    .catch((error) => console.log("Ошибка ", error));
}

async function transliterate(text) {
  const transliterationMap = {
    а: "a",
    б: "b",
    в: "v",
    г: "g",
    д: "d",
    е: "e",
    ё: "e",
    ж: "zh",
    з: "z",
    и: "i",
    й: "y",
    к: "k",
    л: "l",
    м: "m",
    н: "n",
    о: "o",
    п: "p",
    р: "r",
    с: "s",
    т: "t",
    у: "u",
    ф: "f",
    х: "h",
    ц: "c",
    ч: "ch",
    ш: "sh",
    щ: "sch",
    ъ: "",
    ы: "y",
    ь: "",
    э: "e",
    ю: "yu",
    я: "ya",
    ғ: "g",
    ә: "a",
    і: "i",
    қ: "k",
    ң: "n",
    ө: "o",
    ұ: "y",
    ү: "y",
    һ: "h",
  };
  return text
    .toLowerCase()
    .split("")
    .map((char) => transliterationMap[char] || "")
    .join("");
}

function createObjectFromExcelFile(filePath) {
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

  const result = [];
  let currentObject = {};
  data.forEach((row) => {
    if (row[0] && row[1]) {
      const key = row[0];
      const value = row[1];
      currentObject[key] = value;
    } else {
      Object.keys(currentObject).length > 0 ? result.push(currentObject) : "";
      currentObject = {};
    }
  });

  return result;
}

async function onInit() {
  const dataFromExcell = createObjectFromExcelFile(pathExcell);
  for (let data of dataFromExcell) {
    const surname = await transliterate(data["Фамилия"]);
    const split_name = data["Имя"].split("", 1);
    const name = await transliterate(split_name.toString());
    let fio = `${data["Фамилия"]} ${data["Имя"]}`;
    let mail = name + "." + surname;
    await createMails(mail, fio, data["Должность"]);
  }
}

onInit();
