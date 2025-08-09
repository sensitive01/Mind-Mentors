// const axios = require("axios");

// async function getChessKidUser() {
//   try {
//     const response = await axios.get(
//       "https://www.chesskid.com/api/v2/users?ids=11f06627c5048ce88e07bb6767020040",
//       {
//         headers: {
//           "Accept": "application/json, text/plain, */*",
//           "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36",
//           "Cookie": "PHPSESSID=d89cebeb4ae913d98485938c411342cc; login=1; _cf_bm=j_V1DcbeYA4U0.spXkSanlOAUnqT9lWWvyBTTBUJYwE-1754740639-1.0.1.1-QlqIZioJqaEWia5I33nFmUftWaEiX1aIOrgTtA3IWwxw9zGmU7bBfoYrSmYBE1RMUgZpTs3Aou7WHgD_AtaEMMqhZS8a5UKTRNvlapx0Ivk; intercom-session-qzot1t7g=..."
//           // replace this with your full cookie string from browser DevTools
//         }
//       }
//     );

//     console.log("Response Data:", response.data);
//   } catch (error) {
//     console.error(
//       "Error fetching data:",
//       error.response?.status,
//       error.response?.data || error.message
//     );
//   }
// }

// getChessKidUser();

const axios = require("axios");
const qs = require("qs");

async function addMemberToClub() {
  const url =
    "https://www.chesskid.com/clubs/mind-mentorz/add-members?kidsSourceId=11e7fd5d12f7014280004a78600200c0&sortby=username";

  // This matches the "Form Data" you showed (application/x-www-form-urlencoded)
  const formData = qs.stringify({
    csrf: "CK-e0HZARRtJJ2rLo-7pDcm0EWhGTG9vUfmBUtT6B0ikzsc",
    chk_kid_11f0751adfe4b04a91f6a739f6020040: "on",
    btn_add: "",
  });

  try {
    const res = await axios.post(url, formData, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent":
          "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Mobile Safari/537.36",
        Cookie:
          "GCLB=CM7OrZb59pqx0wEQAw; intercom-id-qzot1t7g=1e64b1d8-06e1-4b05-99b3-f3e44842d929; intercom-device-id-qzot1t7g=1e59ab7c-1d98-4cd6-be95-28f2b6e088ec; device_pixel_ratio=2.0000000298023224; PHPSESSID=d89cebeb4ae913d98485938c411342cc; amp_89e2a8=eLh33fvbxZzWBIqUQmHxBj.MTFlNzUyN2FjMjM4ZmZjMjgwMDA0YTc4NjAwMjAwNDA=..1j278hhok.1j27cbhfj.e.p.17; intercom-session-qzot1t7g=OEU5cmRJOU80TXM1RldHc0l1OVM4Wk9lN1lPQS9rQ1J2NXdxVnJ2Y2xRcUU4d0p6Q2VzQWNYMFpMNW9pWjBBWlpxR053aDA3T0kwSlgzbVFFZXVyNVgxM212eWMwdVRLdG5oTGJHYlVFdkU9LS13SEhGOWZYRE5YQ0tLVy92dkhjcHR3PT0=--bee73ab660b3d43371458e6b69326de520072663; __cf_bm=xv612ybQUYoe9nrbnKbJgqw1G17Yc83K8ix1J21O7w8-1754742111-1.0.1.1-TXAQ_QZVjtv6uQgIcWTAaQHgWId.1Sfsh.8fa0DHjIyQxtdx9zxN1Bys.hLHMnT26D.96CKU4V1xlrtuUkaHr1yDFStcLvdjfgAVGqiL9CI",
        Origin: "https://www.chesskid.com",
        Referer:
          "https://www.chesskid.com/clubs/mind-mentorz/add-members?kidsSourceId=11e7fd5d12f7014280004a78600200c0&sortby=username",
      },
      maxRedirects: 0, // prevent auto-follow so we can inspect redirect
      validateStatus: (status) => status < 400, // treat 3xx as success
    });

    console.log("Status:", res.status);
    console.log("Headers:", res.headers);
    console.log("Data:", res.data);
  } catch (err) {
    console.error(
      "Error:",
      err.response?.status,
      err.response?.data || err.message
    );
  }
}

addMemberToClub();
