import { Actor, Color } from "excalibur";
import { PointLightActorArgs, AmbientLightActorArgs, OccluderActorArgs } from "./LightingTypesAndDefs";
import { AmbientLightComponent, OccluderComponent, PointLightComponent } from "./LigthingComponents";

export class PointLight extends Actor {
  private _Plight: PointLightComponent;
  private _PLcolor: Color;
  private _PLintensity: number;
  private _PLfalloff: number;

  constructor(config: PointLightActorArgs) {
    super(config);
    this._Plight = new PointLightComponent({
      color: config.color,
      intensity: config.intensity,
      falloff: config.falloff,
    });
    this._PLcolor = config.color;
    this._PLintensity = config.intensity;
    this._PLfalloff = config.falloff;
    this.addComponent(this._Plight);
  }

  /*Make Getters and Setters for the properties */
  get light() {
    return this._Plight;
  }

  set PLcolor(color: Color) {
    this._Plight.color = color;
    this._PLcolor = color;
  }

  get PLcolor() {
    return this._PLcolor;
  }

  set PLintensity(intensity: number) {
    this._Plight.intensity = intensity;
    this._PLintensity = intensity;
  }

  get PLintensity() {
    return this._PLintensity;
  }

  set PLfalloff(falloff: number) {
    this._Plight.falloff = falloff;
    this._PLfalloff = falloff;
  }

  get PLfalloff() {
    return this._PLfalloff;
  }
}

export class AmbientLight extends Actor {
  private ambient: AmbientLightComponent;
  constructor(config: AmbientLightActorArgs) {
    super(config);
    this.ambient = new AmbientLightComponent({
      color: config.color,
      intensity: config.intensity,
    });
    this.addComponent(this.ambient);
  }
}
export class Occluder extends Actor {
  private occluder: OccluderComponent;
  constructor(config: OccluderActorArgs) {
    super(config);
    this.occluder = new OccluderComponent({
      imageIndex: config.imageIndex,
    });
    this.addComponent(this.occluder);
  }
}
