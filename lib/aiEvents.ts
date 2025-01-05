import dbConnect from "./connectDb";
import { aiChatBotModel } from '../model/User';

interface Eventai {
  title: string;
  description: string;
}

export async function saveAIEvents(title: string, description: string) {
  try {
    await dbConnect();

    const newEvent: Eventai = {
      title: title,
      description: description,
    };
    const event = await aiChatBotModel.findById("676d8bf49e48cdfb0b216f3f");

    if (event) {
      event.Info.events?.push(newEvent);
      await event.save();
      console.log("Event added successfully!");
      return event;
    } else {
      console.log("Event document not found!");
      return null;
    }
  } catch (error) {
    console.error("Error adding event:", error);
    throw new Error("Error saving event");
  }
}
