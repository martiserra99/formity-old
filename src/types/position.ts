export type Position = PositionList | PositionCond | PositionLoop;
export type PositionList = number;
export type PositionCond = ["then" | "else", number];
export type PositionLoop = number;
