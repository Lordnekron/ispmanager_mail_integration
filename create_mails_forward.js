const { instance, baseUrl, elma } = require("./urls.js");

let mails = [];
let passwords = [];

let promises = mails.map((item) => {
  let password = Math.random().toString(36).slice(-11);
  let mail = `${item.split("@")[0]}`;

  return instance
    .get(
      `${baseUrl}&func=email.edit&sok=ok&name=${mail}&domainname=aberto.kz&passwd=${password}&maxsize=70&greylist=on`,
      { timeout: 60000 }
    )
    .then((responce) => responce.data)
    .then((responced) => {
      console.log(`Created ${mail}@aberto.kz with pass ${password}`);
      return instance
        .get(
          `${baseUrl}&func=email.edit&sok=ok&elid=${item}&forward=${mail}@aberto.kz&dontsave=on`,
          { timeout: 60000 }
        )
        .then((responce) => responce.data)
        .then((responced) => {
          passwords.push({ name: mail, pass: password });
          console.log(`Add forward from ${item} to ${mail}@aberto.kz`);
        });
    })
    .catch((err) => {
      console.log(err);
    });
});

Promise.all(promises)
  .then(() => {
    console.log("All operations completed");
    for (let item of passwords) {
      console.log(`Email: ${item.name} Пароль: ${item.pass}`);
    }
  })
  .catch((err) => {
    console.log("Error in operations:", err);
  });
