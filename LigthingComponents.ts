import { Component, Color, Vector } from "excalibur";
import { PointLightComponentConfig, AmbientLightComponentConfig, OccluderComponentConfig } from "./LightingTypesAndDefs";

/*
    Lighting System Components
*/
export class PointLightComponent extends Component {
  color: Color;
  intensity: number;
  falloff: number;
  position: Vector;

  constructor(config: PointLightComponentConfig) {
    super();
    this.color = config.color;
    this.intensity = config.intensity;
    this.falloff = config.falloff;
  }
}

export class AmbientLightComponent extends Component {
  color: Color;
  intensity: number;

  constructor(config: AmbientLightComponentConfig) {
    super();
    this.color = config.color;
    this.intensity = config.intensity;
  }
}
export class OccluderComponent extends Component {
  position: Vector;
  size: Vector;
  angle: number;
  imageIndex: number;

  constructor(config: OccluderComponentConfig) {
    super();

    this.imageIndex = config.imageIndex;
  }
}
