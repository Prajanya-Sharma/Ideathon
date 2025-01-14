"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";

interface MarkerData {
  student_id: string;
  latitude: number;
  longitude: number;
}

interface MapComponentProps {
  onLocationSelect: (lat: number, lng: number) => void;
  initialLocation?: { lat: number; lng: number };
  markers?: MarkerData[];
}

export default function MapComponent({
  onLocationSelect,
  initialLocation,
  markers = [],
}: MapComponentProps) {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const leafletMap = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  const customIcon = L.icon({
    iconUrl:
      "https://res.cloudinary.com/dlinkc1gw/image/upload/v1736740165/location-pin_oqujbl.png",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });

  // Initialize the map only once
  useEffect(() => {
    if (typeof window === "undefined" || !mapRef.current) return;

    if (!leafletMap.current) {
      // Initialize the map
      leafletMap.current = L.map(mapRef.current).setView(
        initialLocation ? [initialLocation.lat, initialLocation.lng] : [30.7652305, 76.7846207],
        17
      );

      // Add tile layer
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(leafletMap.current);

      // Add click event listener for adding/updating the marker
      leafletMap.current.on("click", (e: L.LeafletMouseEvent) => {
        const { lat, lng } = e.latlng;

        // Update or add the marker
        if (markerRef.current) {
          markerRef.current.setLatLng([lat, lng]);
        } else {
          markerRef.current = L.marker([lat, lng], { icon: customIcon }).addTo(leafletMap.current);
        }

        // Trigger the callback
        onLocationSelect(lat, lng);
      });
    }
  }, [onLocationSelect]);

  // Update the marker when initialLocation changes
  useEffect(() => {
    if (initialLocation && leafletMap.current) {
      if (markerRef.current) {
        markerRef.current.setLatLng([initialLocation.lat, initialLocation.lng]);
      } else {
        markerRef.current = L.marker(
          [initialLocation.lat, initialLocation.lng],
          { icon: customIcon }
        ).addTo(leafletMap.current);
      }

      leafletMap.current.setView([initialLocation.lat, initialLocation.lng], 17);
    }
  }, [initialLocation]);

  // Add additional markers when the markers prop changes
  useEffect(() => {
    if (leafletMap.current) {
      markers.forEach((markerData) => {
        const { latitude, longitude, student_id } = markerData;
        L.marker([latitude, longitude], { icon: customIcon })
          .addTo(leafletMap.current!)
          .bindPopup(`Student ID: ${student_id}`);
      });
    }
  }, [markers]);

  return (
    <div
      ref={mapRef}
      style={{ height: "400px", width: "100%", borderRadius: "8px" }}
    />
  );
}
