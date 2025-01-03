'use client'

import React, { useState, useEffect, useRef } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { LatLngExpression } from 'leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

interface MarkerData {
  student_id: string
  latitude: number
  longitude: number
}

const OpenStreetmap: React.FC = () => {
  const [center, setCenter] = useState<LatLngExpression>({ lat: 30.7652305, lng: 76.7846207 })
  const [userLocation, setUserLocation] = useState<LatLngExpression | null>(null)
  const [markers, setMarkers] = useState<Record<string, MarkerData>>({})
  const [studentId, setStudentId] = useState<string>('23104073') // Default student ID
  const wsRef = useRef<WebSocket | null>(null)
  const userLocationRef = useRef<LatLngExpression | null>(null)
  const ZOOM_LEVEL = 10
  const sendLocationTimeout = useRef<NodeJS.Timeout | null>(null)

  // Helper function to convert degrees to radians
  const degreesToRadians = (degrees: number) => {
    return degrees * Math.PI / 180;
  }

  // Function to calculate distance in km between two coordinates
  const distanceInKmBetweenEarthCoordinates = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const earthRadiusKm = 6371;
    const dLat = degreesToRadians(lat2 - lat1);
    const dLon = degreesToRadians(lon2 - lon1);

    lat1 = degreesToRadians(lat1);
    lat2 = degreesToRadians(lat2);

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2); 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); 
    return earthRadiusKm * c;
  }

  useEffect(() => {
    const fetchStudentId = async () => {
      try {
        const response = await fetch("/api/getStudent_Id")
        const data = await response.json()
        if (data.student_id) {
          setStudentId(data.student_id)
          localStorage.setItem('studentId', data.student_id) 
        } else {
          console.error("Error fetching student ID:", data.message)
          setStudentId('23104073') 
        }
      } catch (error) {
        console.error("Error fetching student ID:", error)
        setStudentId('23104073') 
      }
    }

    fetchStudentId()

    const socket = new WebSocket('ws://localhost:3000')
    wsRef.current = socket

    socket.onopen = () => {
      console.log('Connected to WebSocket server')
      sendLocation()
    }

    socket.onmessage = (event) => {
      try {
        console.log('Received data:', event.data)
        const data = JSON.parse(event.data)

        if (data.latitudeData && data.latitudeData.length > 0) {
          const updatedMarkers: Record<string, MarkerData> = {}
          data.latitudeData.forEach((marker: any) => {
            updatedMarkers[marker.student_id] = {
              student_id: marker.student_id,
              latitude: marker.latitude,
              longitude: marker.longitude,
            }
          })

          setMarkers((prevMarkers) => ({
            ...prevMarkers,
            ...updatedMarkers,
          }))
        } else {
          setMarkers({})
          console.log('No friends :(')
        }
        sendLocation()
      } catch (error) {
        console.error('Error parsing WebSocket message:', error)
      }
    }

    socket.onerror = (error) => {
      console.error('WebSocket error:', error)
    }

    return () => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.close()
      }
    }
  }, [])

  useEffect(() => {
    const geoSuccess = (position: GeolocationPosition) => {
      const userLoc = { lat: position.coords.latitude, lng: position.coords.longitude }
      setUserLocation(userLoc)
      userLocationRef.current = userLoc
      setCenter(userLoc)
      sendLocation()
    }

    const geoError = (error: GeolocationPositionError) => {
      console.error('Geolocation error:', error.message)
      setUserLocation({ lat: 0, lng: 0 })
    }

    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(geoSuccess, geoError, {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      })
    } else {
      console.warn('Geolocation not supported by the browser')
    }
  }, [])

  const sendLocation = () => {
    if (wsRef.current?.readyState === WebSocket.OPEN && userLocationRef.current) {
      if (sendLocationTimeout.current) clearTimeout(sendLocationTimeout.current)

      sendLocationTimeout.current = setTimeout(() => {
        const locationData = {
          student_id: studentId,
          latitude: userLocationRef.current!.lat,
          longitude: userLocationRef.current!.lng,
        }
        wsRef.current!.send(JSON.stringify(locationData))
        console.log('Sent location data:', locationData)
      }, 1000)
    } else {
      console.warn('WebSocket not open or user location not available')
    }
  }

  const customIcon = new L.Icon({
    iconUrl: 'https://res.cloudinary.com/dlinkc1gw/image/upload/v1735823181/qq0ndgdcexmxhxnnbgln.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, 32],
  })

  const userIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/149/149071.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, 32],
  })

  return (
    <MapContainer center={center} zoom={ZOOM_LEVEL} style={{ height: '500px', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      {/* Render friends' markers */}
      {Object.values(markers).map((marker) => {
        let distance: string | undefined
        if (userLocation) {
          distance = distanceInKmBetweenEarthCoordinates(userLocation.lat, userLocation.lng, marker.latitude, marker.longitude).toFixed(2) + ' km'
        }

        return (
          <Marker
            key={marker.student_id}
            position={[marker.latitude, marker.longitude]}
            icon={customIcon}
          >
            <Popup>
              Friend ID: {marker.student_id} <br />
              {distance && `Distance from you: ${distance}`}
            </Popup>
          </Marker>
        )
      })}

      {/* Render user's location */}
      {userLocation && (
        <Marker position={userLocation} icon={userIcon}>
          <Popup>
            Your location
          </Popup>
        </Marker>
      )}
    </MapContainer>
  )
}

export default OpenStreetmap
