'use client'

import React, { useState, useEffect, useRef } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { LatLngBoundsExpression, LatLngExpression } from 'leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import axios from 'axios'

interface MarkerData {
  student_id: string
  latitude: number
  longitude: number
  distance?: number // Distance in km
}

interface EventData {
  title: string
  venue: string
  coordinates: {
    lat: number
    lng: number
  }
}

const OpenStreetmap: React.FC = () => {
  const [center, setCenter] = useState<LatLngExpression>({ lat: 30.7652305, lng: 76.7846207 })
  const [userLocation, setUserLocation] = useState<LatLngExpression | null>(null)
  const [markers, setMarkers] = useState<Record<string, MarkerData>>({})
  const [studentId, setStudentId] = useState<string>('')
  const [events, setEvents] = useState<EventData[]>([])
  const wsRef = useRef<WebSocket | null>(null)
  const userLocationRef = useRef<LatLngExpression | null>(null)
  const sendLocationTimeout = useRef<NodeJS.Timeout | null>(null)

  const ZOOM_LEVEL = 17

  // Lock map within these bounds
  const MAX_BOUNDS: LatLngBoundsExpression = [
    [30.690355, 76.723096],
    [30.774525, 76.798471],
  ]

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371000 // Radius of Earth in meters
    const dLat = (lat2 - lat1) * (Math.PI / 180)
    const dLon = (lon2 - lon1) * (Math.PI / 180)
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c // Distance in meters
  }

  useEffect(() => {
    const fetchStudentId = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/getStudentId')
        if (response.data?.student_id) {
          const fetchedStudentId = response.data.student_id
          setStudentId(fetchedStudentId)
          localStorage.setItem('studentId', fetchedStudentId)
        }
      } catch (error) {
        console.error('Failed to fetch student ID:', error)
      }
    }

    const storedStudentId = localStorage.getItem('studentId')
    if (storedStudentId) {
      setStudentId(storedStudentId)
    } else {
      fetchStudentId()
    }
  }, [])

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/events/event-coords')
        if (response.data?.events) {
          setEvents(response.data.events)
        }
      } catch (error) {
        console.error('Failed to fetch events:', error)
      }
    }

    fetchEvents()
  }, [])

  useEffect(() => {
    if (!studentId) return

    const socket = new WebSocket(`${process.env.NEXT_PUBLIC_WS_URL}`)
    wsRef.current = socket

    socket.onopen = () => {
      sendLocation()
    }

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        if (data.latitudeData && data.latitudeData.length > 0) {
          const updatedMarkers: Record<string, MarkerData> = {}
          data.latitudeData.forEach((marker: any) => {
            const distance = userLocation
              ? calculateDistance(
                  userLocation.lat,
                  userLocation.lng,
                  marker.latitude,
                  marker.longitude
                )
              : null
            updatedMarkers[marker.student_id] = {
              student_id: marker.student_id,
              latitude: marker.latitude,
              longitude: marker.longitude,
              distance: distance ? parseFloat((distance / 1000).toFixed(2)) : undefined,
            }
          })
          setMarkers(updatedMarkers)
        } else {
          setMarkers({})
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
  }, [studentId, userLocation])

  useEffect(() => {
    const geoSuccess = (position: GeolocationPosition) => {
      const userLoc = { lat: position.coords.latitude, lng: position.coords.longitude }
      setUserLocation(userLoc)
      userLocationRef.current = userLoc
      setCenter(userLoc)
      sendLocation()
    }

    const geoError = (error: GeolocationPositionError) => {
      setUserLocation({ lat: 0, lng: 0 })
    }

    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(geoSuccess, geoError, {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      })
    }
  }, [])

  const sendLocation = () => {
    if (wsRef.current?.readyState === WebSocket.OPEN && userLocationRef.current) {
      if (sendLocationTimeout.current) clearTimeout(sendLocationTimeout.current)

      sendLocationTimeout.current = setTimeout(() => {
        const locationData = {
          student_id: studentId,
          latitude: userLocationRef.current.lat,
          longitude: userLocationRef.current.lng,
        }
        wsRef.current.send(JSON.stringify(locationData))
      }, 1000)
    }
  }

  const customIcon = new L.Icon({
    iconUrl: 'https://res.cloudinary.com/dlinkc1gw/image/upload/v1735823181/qq0ndgdcexmxhxnnbgln.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, 32],
  })

  const eventIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/149/149064.png',
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
    <div style={{ filter: 'invert(0.95) hue-rotate(210deg)' }}>
      <MapContainer
        center={center}
        zoom={ZOOM_LEVEL}
        style={{ height: '500px', width: '100%' }}
        maxBounds={MAX_BOUNDS}
        maxBoundsViscosity={1.0}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {Object.values(markers).map((marker) => (
          <Marker
            key={marker.student_id}
            position={[marker.latitude, marker.longitude]}
            icon={customIcon}
          >
            <Popup>
              Friend ID: {marker.student_id}
              <br />
              Distance: {marker.distance ? `${marker.distance} km` : 'Calculating...'}
            </Popup>
          </Marker>
        ))}

        {events.map((event, index) => (
          <Marker
            key={index}
            position={[event.coordinates.lat, event.coordinates.lng]}
            icon={eventIcon}
          >
            <Popup>
              Event: {event.title}
              <br />
              Venue: {event.venue}
            </Popup>
          </Marker>
        ))}

        {userLocation && (
          <Marker position={userLocation} icon={userIcon}>
            <Popup>Your location</Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  )
}

export default OpenStreetmap
