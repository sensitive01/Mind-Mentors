const axios = require('axios');

const data = {
  message: {
    messageType: "template",
    name: "skuare_login_otp",
    language: "en",
    components: [
      {
        componentType: "body",
        parameters: [
          {
            type: "text",
            text: "51789"
          }
        ]
      },
      {
        componentType: "button",
        parameters: [
          {
            type: "text",
            text: "51789"
          }
        ],
        index: "0",
        sub_type: "url"
      }
    ]
  },
  to: "919074140114",
  phoneNumberId: "681023478437390"
};

axios.post(
  'https://alb-backend.msgkart.com/api/v1/message/12709045480244860/template?apikey=117d1f35-36b2-4b9a-a695-5fc6a6955386',
  data,
  {
    headers: {
      'Content-Type': 'application/json'
    }
  }
)
.then(response => {
  console.log("✅ Success:", response.data);
})
.catch(error => {
  console.error("❌ Error:", error.response ? error.response.data : error.message);
});
