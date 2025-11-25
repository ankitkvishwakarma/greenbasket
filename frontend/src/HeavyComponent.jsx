import React from "react";

export default function HeavyComponent() {
  return (
    <div style={{ marginTop: 30 }}>
      <h2>This is a Heavy Component</h2>
      <p>Loaded using React.lazy() + Suspense</p>
    </div>
  );
}
