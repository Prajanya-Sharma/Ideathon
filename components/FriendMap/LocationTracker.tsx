"use client"
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

const LocationData = () => {
  const { data: session } = useSession();
  const [studentId, setStudentId] = useState<string | null>(null);
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  useEffect(() => {
    if (session && session.user.isStudent) {
      // Fetch student ID
      fetch("/api/getStudent_Id")
        .then((res) => res.json())
        .then((data) => {
          if (data.student_id) {
            setStudentId(data.student_id);
          } else {
            console.error("Error fetching student ID:", data.message);
          }
        });

      // Get location if geolocation is supported
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setLocation({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
          },
          (error) => {
            console.error("Error fetching location:", error);
          }
        );
      } else {
        console.error("Geolocation is not supported by this browser.");
      }
    }
  }, [session]);

  useEffect(() => {
    // Send location data to WebSocket server once both studentId and location are available
    if (studentId && location) {
      const ws = new WebSocket("ws://localhost:3000"); // WebSocket server URL

      ws.onopen = () => {
        const locationData = {
          student_id: studentId,
          latitude: location.latitude,
          longitude: location.longitude,
        };
        ws.send(JSON.stringify(locationData));
      };

      ws.onmessage = (event) => {
        console.log("Message from server:", event.data);
      };

      ws.onclose = () => {
        console.log("WebSocket connection closed");
      };

      return () => {
        ws.close();
      };
    }
  }, [studentId, location]);

  return null; 
};

export default LocationData;
