import { Component } from "solid-js"

export enum BendingType {
  HIT_LIGHT = -3,
  HIT_MEDIUM = -6,
  HIT_HEAVY = -9,
  DRAW = -15,
  PUNCH = 2,
  BEND = 7,
  UPSET = 13,
  SHRINK = 16
}

export const BendTypeIcon: Component<{type: BendingType}> = (props) => {
  return (
    <>
      <img src={"/images/" + BendingType[props.type].toString().toLowerCase() + ".png"} style="display:inline;"/>
    </>
  )
}
