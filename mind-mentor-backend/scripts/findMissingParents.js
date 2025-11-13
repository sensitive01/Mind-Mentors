const mongoose = require('mongoose');
const Parent = require('../model/parentModel');
const Kid = require('../model/kidModel');
const OperationDept = require('../model/operationDeptModel');
const dbConnect = require('../config/database/dbConnect');

async function findMissingParents() {
  try {
    // Connect to the database
    await dbConnect();
    console.log('Connected to MongoDB');

    // Create a new collection to store the results
    const db = mongoose.connection.db;
    const missingParentsCollection = db.collection('missing_parents_analysis');
    
    // Clear existing data in the collection
    await missingParentsCollection.deleteMany({});

    // Find all operation records
    const operations = await OperationDept.find({}, 'parentId parentMobile parentName contactNumber whatsappNumber').lean();
    
    // Find all unique parent IDs
    const parentIds = [...new Set(operations.map(op => op.parentId?.toString()))].filter(Boolean);
    
    // Find all parents that exist in the database
    const existingParents = await Parent.find({ _id: { $in: parentIds } }, '_id parentMobile parentName');
    const existingParentIds = new Set(existingParents.map(p => p._id.toString()));
    
    // Find operations with parent IDs that don't exist in the parents collection
    const missingParentOps = operations.filter(op => 
      op.parentId && !existingParentIds.has(op.parentId.toString())
    );

    console.log(`Found ${missingParentOps.length} operations with missing parents`);
    
    // Save the results to the collection
    if (missingParentOps.length > 0) {
      await missingParentsCollection.insertMany(missingParentOps);
      console.log(`Saved ${missingParentOps.length} missing parent records to missing_parents_analysis collection`);
      
      // Print a sample of the missing parents
      console.log('\nSample of missing parent records:');
      console.log(missingParentOps.slice(0, 5));
    } else {
      console.log('No missing parents found!');
    }

    // Also analyze parent-kid relationships
    const kids = await Kid.find({}, 'parentId').lean();
    const kidsWithMissingParents = kids.filter(kid => 
      kid.parentId && !existingParentIds.has(kid.parentId.toString())
    );
    
    console.log(`\nFound ${kidsWithMissingParents.length} kids with missing parents`);
    
    // Save kids with missing parents
    if (kidsWithMissingParents.length > 0) {
      await db.collection('kids_with_missing_parents').deleteMany({});
      await db.collection('kids_with_missing_parents').insertMany(kidsWithMissingParents);
      console.log(`Saved ${kidsWithMissingParents.length} kids with missing parents to kids_with_missing_parents collection`);
    }

    // Find parents that have no kids
    const parentKidCounts = {};
    kids.forEach(kid => {
      const parentId = kid.parentId?.toString();
      if (parentId) {
        parentKidCounts[parentId] = (parentKidCounts[parentId] || 0) + 1;
      }
    });

    const parentsWithNoKids = existingParents.filter(
      p => !parentKidCounts[p._id.toString()]
    );
    
    console.log(`\nFound ${parentsWithNoKids.length} parents with no kids`);
    
    // Save parents with no kids
    if (parentsWithNoKids.length > 0) {
      await db.collection('parents_with_no_kids').deleteMany({});
      await db.collection('parents_with_no_kids').insertMany(parentsWithNoKids);
      console.log(`Saved ${parentsWithNoKids.length} parents with no kids to parents_with_no_kids collection`);
    }

    console.log('\nAnalysis complete!');
    process.exit(0);
  } catch (error) {
    console.error('Error in findMissingParents:', error);
    process.exit(1);
  }
}

findMissingParents();
