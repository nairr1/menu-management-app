export function getNewPosition(lastPositionObj: { position: number; }[] | undefined) {
    let newPosition = 0;
    if (lastPositionObj && lastPositionObj.length > 0) {
        newPosition = lastPositionObj[0]?.position as number + 1;
    }

    return newPosition;
}