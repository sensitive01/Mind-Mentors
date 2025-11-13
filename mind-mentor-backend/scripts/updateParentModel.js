const mongoose = require('mongoose');
const Parent = require('../model/parentModel');
const dbConnect = require('../config/database/dbConnect');

async function updateParentModel() {
  try {
    // Connect to the database
    await dbConnect();
    console.log('Connected to MongoDB');

    // Update all parent documents to convert parentMobile to String
    const result = await Parent.updateMany(
      {},
      [
        {
          $set: {
            parentMobile: { $toString: "$parentMobile" }
          }
        }
      ]
    );

    console.log(`Updated ${result.nModified} parent documents`);

    // Change the schema type
    const collection = mongoose.connection.collection('parents');
    await collection.updateMany(
      {},
      { $set: { parentMobile: { $toString: "$parentMobile" } } }
    );

    console.log('Schema updated successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error updating parent model:', error);
    process.exit(1);
  }
}

updateParentModel();
