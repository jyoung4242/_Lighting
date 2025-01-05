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
    this.position = config.position;
  }
}

export class AmbientLightComponent extends Component {
  color: Color;
  intensity: number;
  position: Vector;

  constructor(config: AmbientLightComponentConfig) {
    super();
    this.color = config.color;
    this.intensity = config.intensity;
    this.position = config.position;
  }
}
export class OccluderComponent extends Component {
  position: Vector;
  size: Vector;
  angle: number;
  imageIndex: number;

  constructor(config: OccluderComponentConfig) {
    super();
    this.position = config.position;
    this.size = config.size;
    this.angle = config.angle;
    this.imageIndex = config.imageIndex;
  }
}
