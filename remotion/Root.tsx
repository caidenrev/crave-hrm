import React from "react";
import { Composition } from "remotion";
import { HrmDemo, HRM_DEMO_DURATION } from "./HrmDemo";

export function RemotionRoot() {
  return (
    <>
      <Composition
        id="CraveHrmDemo-Landscape"
        component={HrmDemo}
        durationInFrames={HRM_DEMO_DURATION}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{ vertical: false }}
      />
      <Composition
        id="CraveHrmDemo-Vertical"
        component={HrmDemo}
        durationInFrames={HRM_DEMO_DURATION}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ vertical: true }}
      />
    </>
  );
}
