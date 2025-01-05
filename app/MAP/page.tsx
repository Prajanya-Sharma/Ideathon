import dynamic from 'next/dynamic';
import React from 'react';

const OpenStreetMap = dynamic(() => import('../../components/OpenStreetMap/ostm'), {});

const Index: React.FC = () => {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
       
        alignItems: 'center',
        background: 'linear-gradient(to bottom, #001f3f, #000000)',
        color: 'white',
        textAlign: 'center',
      }}
    >
      <h1 style={{ marginBottom: '10px', fontSize: '2.5rem', }}>
        College Map
      </h1>
      <div
        id="map-container"
        style={{
          height: '80vh',
          width: '70vw',
          borderRadius: '10px',
          overflow: 'hidden',
          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.7)',
        }}
      >
        <OpenStreetMap />
      </div>
    </div>
  );
};

export default Index;
