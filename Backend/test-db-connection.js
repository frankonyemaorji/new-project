const { MongoClient } = require("mongodb");

const uri =
  "mongodb+srv://frankonyemaorji1:20jY0oeZ7YNq3Mdx@educonnect-cluster.zpbgyk4.mongodb.net/educonnect-africa?retryWrites=true&w=majority&appName=educonnect-cluster";

async function testConnection() {
  const client = new MongoClient(uri, {
    serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
    socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
  });

  try {
    console.log("Attempting to connect to MongoDB Atlas...");
    await client.connect();
    console.log("✅ Successfully connected to MongoDB Atlas!");

    // Test a simple operation
    const db = client.db("educonnect-africa");
    const collections = await db.listCollections().toArray();
    console.log(
      "✅ Database accessible, collections:",
      collections.map((c) => c.name)
    );
  } catch (error) {
    console.error("❌ Connection failed:", error.message);
    console.error("Error details:", error);
  } finally {
    await client.close();
    console.log("Connection closed.");
  }
}

testConnection();
