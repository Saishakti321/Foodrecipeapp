import React from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"

function FloatingBox() {
  return (
    <mesh rotation={[0.4, 0.2, 0]}>
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial color="#ec4899" />
    </mesh>
  )
}

export default function FoodModel() {
  return (
    <div style={{ width: "100%", height: "350px" }}>
      <Canvas>
        <ambientLight intensity={0.8} />
        <directionalLight position={[2, 5, 2]} />
        <FloatingBox />
        <OrbitControls enableZoom={false} />
      </Canvas>
    </div>
  )
}