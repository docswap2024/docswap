'use client';

import { useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import React from 'react';

let map: mapboxgl.Map | null = null;
mapboxgl.accessToken = 'pk.eyJ1Ijoibm1hbmRpdmV5aSIsImEiOiJja2x5Z3o5N3kwMTlzMnVwOG8yaHFsbm9iIn0.Hnx3npUN7PTiOZSH8ju1kA';

interface MapboxMapProps {
    containerId?: string;
    center?: [number, number];
    zoom?: number;
    style?: string;
}

export const BackgroundMap = ({
    containerId = 'map',
    center = [-123.144, 49.258], // Default center: Vancouver, Canada
    zoom = 11,
    style = "mapbox://styles/nmandiveyi/cm0o3g86n003u01pqf4ykcpc1"
}: MapboxMapProps) => {

    useEffect(() => {
  
        map = new mapboxgl.Map({
            container: containerId,
            style: style,
            center: center,
            zoom: zoom,
            bearing: 0,
            pitch: 0,
            cooperativeGestures: true,
        });
          
    }, [containerId, center, zoom, style]); 

    return (
        <>
        <div id="map" className="w-full h-full">
        </div>
        </>
    );

}