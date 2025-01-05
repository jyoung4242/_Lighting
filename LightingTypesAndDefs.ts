import { ActorArgs, Color, Vector } from "excalibur";

export type PointLightActorArgs = ActorArgs & PointLightComponentConfig;
export type AmbientLightActorArgs = ActorArgs & AmbientLightComponentConfig;
export type OccluderActorArgs = ActorArgs & OccluderComponentConfig;

/*
    Lighting System Component Configs
*/

export interface PointLightComponentConfig {
  color: Color;
  intensity: number;
  falloff: number;
  position: Vector;
}

export interface AmbientLightComponentConfig {
  color: Color;
  intensity: number;
  position: Vector;
}
export interface OccluderComponentConfig {
  position: Vector;
  size: Vector;
  angle: number;
  imageIndex: number;
}
