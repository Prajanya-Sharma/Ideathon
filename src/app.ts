import express from "express";
import { createServer } from "http";
import { WebSocket, WebSocketServer } from "ws";
import dotenv from "dotenv";
import QueueHandler from "./worker/queueHandler";
import FriendDataHandler from "./worker/frinedsDataHandler";
import CacheHandler from "./worker/cacheHandler";
import { LocationData } from "./types/locationData";

dotenv.config();

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server });

const queueHandler = new QueueHandler();
const friendDataHandler = new FriendDataHandler();
const cacheHandler = new CacheHandler();

const LOCATION_UPDATE_INTERVAL = 1000;
const PORT = 3000;

const clientsMap: Map<string, WebSocket> = new Map();

app.use(express.json());

wss.on("connection", (ws) => {
  console.log("A user connected");

  // Get student_id when a new WebSocket connection is established
  ws.on("message", async (message) => {
    try {
      const data: LocationData = JSON.parse(message.toString());
      const { student_id, latitude, longitude } = data;

      // Store WebSocket connection with student_id in the map
      clientsMap.set(student_id, ws);
      console.log(`Connected: ${student_id}`);

      // Store the location data in cache with a TTL of 600 seconds (10 minutes)
      await cacheHandler.setLocation(student_id, { student_id, latitude, longitude }, 600);

      // Get the list of the student's friends
      const friends = await friendDataHandler.getFriends(student_id);
      const friendsIds = friends.map((friend) => friend.student_id);
      console.log(`Friends of ${student_id}: ${JSON.stringify(friendsIds)}`);

      // If the student has no friends, enqueue the location update
      if (friends.length === 0) {
        await queueHandler.enqueueLocationUpdate(student_id, latitude, longitude, []);
      } else {
        // Get the location data of the friends from the cache
        const friendsLocations = await cacheHandler.getFriendsLocations(friendsIds);
        console.log(`Friends' location data: ${JSON.stringify(friendsLocations)}`);

        // Enqueue the location update with friends' locations
        await queueHandler.enqueueLocationUpdate(student_id, latitude, longitude, friendsLocations);
        console.log("Location update added to the queue");

        // Now send the location data to each of the connected friends via WebSocket
        friendsLocations.forEach((friendLocation) => {
          const friendWs = clientsMap.get(friendLocation.student_id);
          if (friendWs) {
            friendWs.send(JSON.stringify({
              student_id: student_id,
              latitude: latitude,
              longitude: longitude,
              friends_locations: friendsLocations,
            }));
            console.log(`Sent location data to friend: ${friendLocation.student_id}`);
          }
        });
      }
    } catch (error) {
      console.error("Error handling location update:", error);
    }
  });

  // When a WebSocket connection closes
  ws.on("close", async () => {
    let disconnectedStudentId: string | undefined;
    clientsMap.forEach((client, student_id) => {
      if (client === ws) {
        disconnectedStudentId = student_id;
      }
    });

    if (disconnectedStudentId) {
      await cacheHandler.removeLocation(disconnectedStudentId);
      clientsMap.delete(disconnectedStudentId);
      console.log(`Removed client with student_id: ${disconnectedStudentId}`);
    }
  });
});

// Periodically process the queue
setInterval(async () => {
  try {
    const queueSize = await queueHandler.getQueueSize();
    if (queueSize > 0) {
      console.log(`Queue size: ${queueSize} items waiting for processing`);

      const batchSize = 1;
      await queueHandler.processQueueBatch(batchSize, clientsMap);
    } else {
      console.log("No location updates in the queue");
    }
  } catch (error) {
    console.error("Error processing location updates:", error);
  }
}, LOCATION_UPDATE_INTERVAL);

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
