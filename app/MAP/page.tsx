"use client"
import dynamic from 'next/dynamic';

const OpenStreetMap = dynamic(() => import('../../components/OpenStreetMap/ostm'), {
   // Disable server-side rendering for this component
});

const Index: React.FC = () => {
  return (
    <>
      <h1 className="text-center">OpenStreetMap</h1>
      <div id="map-container">
        <OpenStreetMap />
      </div>
    </>
  );
};

export default Index;
