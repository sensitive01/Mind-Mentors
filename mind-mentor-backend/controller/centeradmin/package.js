const packagesData = [
  {
    packageId: "O8",
    type: "online",
    packageName: "Online 8 classes 10 am to 7 pm",
    onlineClasses: 8,
    pricing: {
      amount: 3590,
      tax: 646,
      total: 4236,
    },
  },
  {
    packageId: "O16",
    type: "online",
    packageName: "Online 16 classes 10 am to 7 pm",
    onlineClasses: 16,
    pricing: {
      amount: 5990,
      tax: 1078,
      total: 7068,
    },
  },
  {
    packageId: "O8",
    type: "online",
    packageName: "Online 8 classes 8 pm to 8 am",
    onlineClasses: 8,
    pricing: {
      amount: 4590,
      tax: 826,
      total: 5416,
    },
  },
  {
    packageId: "O16",
    type: "online",
    packageName: "Online 16 classes 8 pm to 8 am",
    onlineClasses: 16,
    pricing: {
      amount: 6990,
      tax: 1258,
      total: 8248,
    },
  },
  {
    packageId: "PC8",
    type: "offline",
    packageName: "Offline 8 classes 10 am to 7 pm",
    physicalClasses: 8,
    centerName: "center name",
    pricing: {
      amount: 3590,
      tax: 646,
      total: 4236,
    },
  },
  {
    packageId: "PC16",
    type: "offline",
    packageName: "Offline 16 classes 10 am to 7 pm",
    physicalClasses: 16,
    centerName: "center name",
    pricing: {
      amount: 5990,
      tax: 1078,
      total: 7068,
    },
  },
  {
    packageId: "HYB",
    type: "hybrid",
    packageName: "Hybrid day classes",
    onlineClasses: 1,
    pricing: {
      amount: 400,
      tax: 72,
      total: 472,
    },
  },
  {
    packageId: "HYB",
    type: "hybrid",
    packageName: "Online night & center day classes",
    onlineClasses: 1,
    pricing: {
      amount: 500,
      tax: 90,
      total: 590,
    },
  },
  {
    packageId: "HYB",
    type: "hybrid",
    packageName: "Hybrid day classes",
    physicalClasses: 1,
    centerName: "center name",
    pricing: {
      amount: 600,
      tax: 108,
      total: 708,
    },
  },
  {
    packageId: "KIT1",
    type: "kit",
    packageName: "item name",
    pricing: {
      amount: 799,
      tax: 144,
      total: 942.82,
    },
  },
];

module.exports = packagesData;
