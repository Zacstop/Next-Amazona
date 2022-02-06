import mongoose from 'mongoose';

const connection = {};

async function connect() {
  if (connection.isConnetcted) {
    console.log('already connected');
    return;
  }
  if (mongoose.connections.length > 0) {
    connection.isConnetcted = mongoose.connections[0].readyState;
    if (connection.isConnetcted === 1) {
      console.log('use previous connection');
      return;
    }
    await mongoose.disconnect();
  }
  const db = await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // useCreateIndex: true,
  });
  console.log('new connection');
  connection.isConnetcted = db.connections[0].readyState;
}

async function disconnect() {
  if (connection.isConnetcted) {
    if (process.env.NODE_ENV === 'production') {
      await mongoose.disconnect();
      connection.isConnetcted = false;
    } else {
      console.log('not disconnected');
    }
  }
}

function convertDocToObj(doc) {
  doc._id = doc._id.toString();
  doc.createdAt = doc.createdAt.toString();
  doc.updatedAt = doc.updatedAt.toString();
  return doc;
}

const db = { connect, disconnect, convertDocToObj };
export default db;
