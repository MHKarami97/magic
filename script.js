function fetchData(theUrl) {
  let list = [];

  return fetch(theUrl)
    .then((response) => response.json())
    .then((data) => {
      for (let item of data) {
        let url = item.download_url;
        let file = item.name;

        list.push({ url, file });
      }

      return list;
    })
    .catch((error) => console.error(error));
}

function fetchDataAsString(theUrl) {
  return fetch(theUrl)
    .then((data) => {
      return data.text();
    })
    .catch((error) => console.error(error));
}

function randomItem(list) {
  if (list.length === 0) {
    return null;
  } else {
    let index = Math.floor(Math.random() * list.length);

    return list[index];
  }
}

function getTitle(str) {
  let lines = str.split("\n");

  for (let line of lines) {
    if (line.startsWith("title")) {
      var tmp = line.split(":")[1];

      tmp = tmp.replaceAll('"', "").trim();

      return tmp;
    }
  }
}

function getCategory(str) {
  let lines = str.split("\n");
  let nextLine = false;
  for (let line of lines) {
    if (nextLine === true) {
      var tmp = line.split("-")[1];

      tmp = tmp.trim().toLowerCase();

      return tmp;
    }
    if (line.startsWith("categories")) {
      nextLine = true;
    }
  }
}

function removeBlankLine(str) {
  return str.replace(/(^[ \t]*\n)/gm, "");
}

function printData(data) {
  console.log(`./img/${data.name}.jpg`);
  let template = `
  <div class="col" ontouchstart="this.classList.toggle('hover');">
      <div class="container">
          <div class="front" style="background-image: url('./img/${data.name}.jpg')">
              <div class="inner">
                  <p>${data.name.toUpperCase()}</p>
                  <span>${data.persianTxt}</span>
              </div>
          </div>
          <div class="back">
              <div class="inner">
                  <p><a href="${data.siteUrl}">${data.text}</a></p>
              </div>
          </div>
      </div>
  </div>
  `;

  document.getElementById("main").innerHTML += template;
}

function load() {
  let urls = [
    {
      url: "https://api.github.com/repos/mhkarami97/travel/contents/_posts",
      name: "travel",
      persianTxt: "بیا با هم بریم سفر"
    },
    {
      url: "https://api.github.com/repos/mhkarami97/video/contents/_posts",
      name: "video",
      persianTxt: "یه فیلم با هم ببینیم"
    },
    {
      url: "https://api.github.com/repos/mhkarami97/book/contents/_posts",
      name: "book",
      persianTxt: "کتاب بهترین رفیق تنهایی آدمه"
    },
    {
      url: "https://api.github.com/repos/mhkarami97/music/contents/_posts",
      name: "music",
      persianTxt: "خرم آن نغمه که مردم بسپارند به یاد"
    },
    {
      url: "https://api.github.com/repos/mhkarami97/poem/contents/_posts",
      name: "poem",
      persianTxt: "نذر کردم که اگر سهم من از عشق شدی دو سه رکعت غزلِ شاد بخوانم هر روز"
    },
    {
      url: "https://api.github.com/repos/mhkarami97/trip/contents/_posts",
      name: "trip",
      persianTxt: "مجازی سفر کن"
    },
    {
      url: "https://api.github.com/repos/mhkarami97/trick/contents/_posts",
      name: "trick",
      persianTxt: "یه نکته کاربردی که ممکنه به‌دردت بخوره"
    },
    {
      url: "https://api.github.com/repos/mhkarami97/blog/contents/_posts",
      name: "blog",
      persianTxt: "وقت یه درس تخصصی فنی هستش"
    },
    {
      url: "https://api.github.com/repos/mhkarami97/link/contents/_posts",
      name: "link",
      persianTxt: "بریم تو دنیای اینترنت غرق بشیم"
    },
    {
      url: "https://api.github.com/repos/mhkarami97/sentence/contents/_posts",
      name: "sentence",
      persianTxt: "بعضی وقتا یه جمله می‌تونه آدم رو عوض کنه"
    },
  ];

  let textData = ["sentence", "poem"];

  urls.forEach((data) => {
    let name = data.name;
    let persianTxt = data.persianTxt;

    fetchData(data.url)
      .then((list) => {
        let item = randomItem(list);
        let file = item.file;

        fetchDataAsString(item.url).then((dataAsString) => {
          let text;
          let siteUrl;
          let tmpName;

          if (textData.includes(name)) {
            let infos = dataAsString.split("---")[2];
            text = removeBlankLine(infos);
          } else {
            let infos = dataAsString.split("---")[1];
            text = getTitle(infos);
          }

          switch (name) {
            case "travel":
            case "video":
            case "music":
            case "trip":
              tmpName = file.split("-")[3].split(".")[0];
              siteUrl = "https://" + name + ".mhkarami97.ir/" + tmpName;
              break;

            case "blog":
              let category = getCategory(dataAsString.split("---")[1]);
              tmpName = file.split("-")[3].split(".")[0];
              siteUrl =
                "https://" +
                name +
                ".mhkarami97.ir/" +
                category +
                "/" +
                tmpName;
              break;

            case "book":
              tmpName = file.split(".")[0];
              siteUrl = "https://" + name + ".mhkarami97.ir/" + tmpName;
              break;

            case "trick":
              tmpName = file.split(".")[0];
              siteUrl =
                "https://" +
                name +
                ".mhkarami97.ir/" +
                tmpName.replaceAll("-", "/");
              break;

            case "link":
              siteUrl = "https://" + text;
              break;

            default:
              siteUrl = "https://" + name + ".mhkarami97.ir";
              break;
          }

          printData({
            name,
            text,
            persianTxt,
            siteUrl,
          });
        });
      })
      .catch((error) => console.error(error));
  });
}

load();
