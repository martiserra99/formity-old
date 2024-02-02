type Position = PositionList | PositionCond | PositionLoop;
type PositionList = number;
type PositionCond = ['then' | 'else', number];
type PositionLoop = number;

export { Position, PositionList, PositionCond, PositionLoop };
