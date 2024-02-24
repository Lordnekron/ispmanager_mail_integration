const { instance, baseUrl } = require("./urls.js");

let mails = [];

instance
  .get(`${baseUrl}&func=email`)
  .then((responced) => {
    let responce = responced.data;
    responce.forEach((responce) => {
      let responceSplit = responce.name.split("@");
      if (
        responceSplit[1] === "divera.kz" &&
        responce.size_used < responce.size_total &&
        responce.dontsave === "off" &&
        !responce.name.includes("pk.") &&
        !responce.name.includes("mc.")
      ) {
        mails.push(responce);
      }
    });
    console.log("Найдены почты:", mails.length);
    return mails;
  })
  .then((mails) => {
    function Mailings(name, mails, mailingName) {
      (this.name = name),
        (this.mails = mails),
        (this.mailingName = mailingName);
    }
    let allMailings = {
      oskemenMails: new Mailings(
        ["Усть-Каменогорск", "OMG Оскемен"],
        [],
        "vko.inform"
      ),
      semeyMails: new Mailings("Семей", [], "semey.inform"),
      kyzylordaMails: new Mailings("Кызылорда", [], "kyzylorda.inform"),
      atyrauMails: new Mailings("Атырау", [], "atyrau.inform"),
      aktobeMails: new Mailings("Актобе", [], "aktobe.inform"),
      pavlodarMals: new Mailings("Павлодар", [], "pavlodar.inform"),
      astanaMails: new Mailings(
        ["Астана", "Нур-султан", "OMG ГО"],
        [],
        "astana.inform"
      ),
      shymkentMails: new Mailings("Шымкент", [], "shymkent.inform"),
      kokshetauMails: new Mailings("Кокшетау", [], "kokshetau.inform"),
      karagandaMails: new Mailings("Караганда", [], "karaganda.inform"),
      taldykorganMails: new Mailings(
        ["OMG Алматинский", "Талдыкорган"],
        [],
        "taldykorgan.inform"
      ),
      almatyMails: new Mailings("Алматы", [], "almaty.inform"),
      zkfMails: new Mailings(["Уральск", "OMG ЗКФ"], [], "zkf.inform"),
      skfMails: new Mailings(["Петропавловск", "OMG СКФ"], [], "skf.inform"),
      defaultMails: new Mailings("", [], "inform"),
    };

    mails.forEach((mail) => {
      let found = false;
      for (const [key, value] of Object.entries(allMailings)) {
        if (
          mail.note &&
          (Array.isArray(value.name)
            ? value.name.some((name) => mail.note.includes(name))
            : mail.note.includes(value.name))
        ) {
          value.mails.push(mail.name);

          found = true;
          break;
        }
      }
      if (!found) {
        allMailings.defaultMails.mails.push(mail.name);
      }
    });
    console.log("Ускаман: ", allMailings.oskemenMails.mails.length);
    console.log("Семей", allMailings.semeyMails.mails.length);
    console.log("Кызылорда", allMailings.kyzylordaMails.mails.length);
    console.log("Атырау", allMailings.atyrauMails.mails.length);
    console.log("Актобе", allMailings.aktobeMails.mails.length);
    console.log("Павлодар", allMailings.pavlodarMals.mails.length);
    console.log("Астана", allMailings.astanaMails.mails.length);
    console.log("Шымкент", allMailings.shymkentMails.mails.length);
    console.log("Кокшетау", allMailings.kokshetauMails.mails.length);
    console.log("Караганда", allMailings.karagandaMails.mails.length);
    console.log("Талдыкорган", allMailings.taldykorganMails.mails.length);
    console.log("Алматы", allMailings.almatyMails.mails.length);
    console.log("Уральск", allMailings.zkfMails.mails.length);
    console.log("Петропавловск", allMailings.skfMails.mails.length);
    console.log("По умолчанию", allMailings.defaultMails.mails.length);

    let kostyl = allMailings.defaultMails.mails.findIndex((i) => {
      return i === "inform@divera.kz";
    });
    allMailings.defaultMails.mails.splice(kostyl, 1);

    for (const [key, value] of Object.entries(allMailings)) {
      if (key !== "defaultMails") {
        allMailings.defaultMails.mails.push(`${value.mailingName}@divera.kz`);
      }
    }

    for (const [key, value] of Object.entries(allMailings)) {
      allMailings.defaultMails.mails.push();
      let password = Math.random().toString(36).slice(-11);
      if (key !== "defaultMails") {
        instance
          .get(
            `${baseUrl}&func=email.edit&sok=ok&name=${
              value.mailingName
            }&domainname=divera.kz&passwd=${password}&dontsave=on&maxsize=70&greylist=on&forward=${value.mails.join(
              " "
            )}`
          )
          .then((responce) => responce.data)
          .then((responce) => {
            console.log(`Created ${value.mailingName}`);
            //console.log(responce);
            if (responce.error.code === "exists") {
              instance
                .get(
                  `${baseUrl}&func=email.edit&sok=ok&elid=${
                    value.mailingName
                  }@divera.kz&forward=${value.mails.join(" ")}&dontsave=on`
                )
                .then((responce) => responce.data)
                .then((responce) => {
                  console.log(`Updated ${value.mailingName}`);
                  console.log(responce);
                })
                .catch((err) => console.log(err));
            }
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        axios
          .get(
            `${URL}&func=email.edit&sok=ok&elid=inform@divera.kz&forward=${value.mails.join(
              " "
            )}&dontsave=on`
          )
          .then((responce) => responce.data)
          .then((responce) => {
            console.log(`Inform updated ${value.mailingName}`);
            console.log(responce);
          })
          .catch((err) => console.log(err));
      }
    }
  })
  .catch((error) => console.log("Ошибка ", error));
