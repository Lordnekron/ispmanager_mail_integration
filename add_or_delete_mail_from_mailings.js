const { instance, baseUrl, elma } = require("./urls.js");
const readline = require("readline");

async function getMailings(value) {
  try {
    let mailings = [];
    const response = await instance
      .get(`${baseUrl}&func=email`)
      .then((responce) => {
        let mails = responce.data;
        mails.forEach((mail) => {
          if (mail.name.includes(value)) {
            mailings.push(mail.name);
          }
        });
      });
    return mailings;
  } catch (error) {
    console.log("Ошибка ", error);
    throw error; // Проброс ошибки вверх по стеку вызовов
  }
}

async function deleteMailfromMailings(mailing, mailToDelete) {
  try {
    const mailings = await getMailings(mailing);

    for (const mail of mailings) {
      const response = await instance.get(
        `${baseUrl}&func=email.edit&elid=${mail}`
      );
      const mails = response.data;
      const arrayMails = mails.forward.split(" ");

      const filtredMails = arrayMails.filter(
        (email) => email && email !== mailToDelete
      );
      const updateResponse = await instance.get(
        `${baseUrl}&func=email.edit&elid=${mail}&sok=ok&forward=${filtredMails.join(
          " "
        )}`
      );

      console.log(updateResponse.data);
    }
  } catch (error) {
    console.error("Ошибка при обработке рассылок:", error);
  }
}

async function addMailtoMailings(mailing, mailToAdd) {
  try {
    const mailings = await getMailings(mailing);

    for (const mail of mailings) {
      const response = await instance.get(
        `${baseUrl}&func=email.edit&elid=${mail}`
      );
      const mails = response.data;
      const arrayMails = mails.forward.split(" ");

      arrayMails.push(mailToAdd);

      const updateResponse = await instance.get(
        `${baseUrl}&func=email.edit&elid=${mail}&sok=ok&forward=${arrayMails.join(
          " "
        )}`
      );

      console.log(updateResponse.data);
    }
  } catch (error) {
    console.error("Ошибка при обработке рассылок:", error);
  }
}

async function promptUser() {
  const options = ["Добавить email", "Удалить email"];
  let selectedIndex = 0;

  console.clear();
  console.log("Выберите действие (используйте стрелки ↑/↓ и Enter):");
  renderMenu(options, selectedIndex);

  return new Promise((resolve) => {
    process.stdin.setRawMode(true);
    process.stdin.resume();

    process.stdin.on("data", (key) => {
      if (key.toString() === "\u0003") {
        // Ctrl+C для выхода
        process.exit();
      } else if (key.toString() === "\r") {
        // Enter для подтверждения выбора
        process.stdin.setRawMode(false);
        process.stdin.pause();
        console.clear();
        resolve(selectedIndex === 0 ? "add" : "delete");
      } else if (key.toString() === "\u001b[A") {
        // Стрелка вверх
        selectedIndex = (selectedIndex - 1 + options.length) % options.length;
        console.clear();
        console.log("Выберите действие (используйте стрелки ↑/↓ и Enter):");
        renderMenu(options, selectedIndex);
      } else if (key.toString() === "\u001b[B") {
        // Стрелка вниз
        selectedIndex = (selectedIndex + 1) % options.length;
        console.clear();
        console.log("Выберите действие (используйте стрелки ↑/↓ и Enter):");
        renderMenu(options, selectedIndex);
      }
    });
  });
}

function renderMenu(options, selectedIndex) {
  options.forEach((option, index) => {
    if (index === selectedIndex) {
      console.log(`> ${option}`); // Выделяем выбранный пункт
    } else {
      console.log(`  ${option}`);
    }
  });
}

async function askQuestion(query) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(query, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}

async function main() {
  try {
    const action = await promptUser();

    // Возвращаем stdin в нормальный режим перед использованием readline
    if (process.stdin.isTTY) {
      process.stdin.setRawMode(false);
      process.stdin.pause();
    }

    const mailing = await askQuestion("Введите название рассылки: ");
    const email = await askQuestion("Введите email: ");

    if (action === "add") {
      await addMailtoMailings(mailing, email);
    } else if (action === "delete") {
      await deleteMailfromMailings(mailing, email);
    }
  } catch (error) {
    console.error("Ошибка при выполнении операции:", error);
  } finally {
    // Убедимся, что stdin возвращен в нормальный режим
    if (process.stdin.isTTY) {
      process.stdin.setRawMode(false);
      process.stdin.pause();
    }
  }
}

// Запуск программы
main();
