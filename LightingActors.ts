import { Actor, Color } from "excalibur";
import { PointLightActorArgs, AmbientLightActorArgs, OccluderActorArgs } from "./LightingTypesAndDefs";
import { AmbientLightComponent, OccluderComponent, PointLightComponent } from "./LigthingComponents";

export class PointLight extends Actor {
  private _Plight: PointLightComponent;
  private _PLintensity: number;
  private _PLfalloff: number;

  constructor(config: PointLightActorArgs) {
    super(config);
    this._Plight = new PointLightComponent({
      color: config.color,
      intensity: config.intensity,
      falloff: config.falloff,
    });

    this._PLintensity = config.intensity;
    this._PLfalloff = config.falloff;
    this.addComponent(this._Plight);
  }

  /*Make Getters and Setters for the properties */
  get light() {
    return this._Plight;
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
  private _ALintensity: number;

  constructor(config: AmbientLightActorArgs) {
    super(config);
    this.ambient = new AmbientLightComponent({
      color: config.color,
      intensity: config.intensity,
    });
    this._ALintensity = config.intensity;
    this.addComponent(this.ambient);
  }

  set ALintensity(intensity: number) {
    this.ambient.intensity = intensity;
    this._ALintensity = intensity;
  }

  get ALintensity() {
    return this._ALintensity;
  }
}
export class Occluder extends Actor {
  private occluder: OccluderComponent;
  private _imageIndex: number;

  constructor(config: OccluderActorArgs) {
    super(config);
    this.occluder = new OccluderComponent({
      imageIndex: config.imageIndex,
    });
    this.addComponent(this.occluder);
    this._imageIndex = config.imageIndex;
  }

  get imageIndex() {
    return this._imageIndex;
  }

  set imageIndex(index: number) {
    this.occluder.imageIndex = index;
    this._imageIndex = index;
  }
}
