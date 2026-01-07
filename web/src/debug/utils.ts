export function canOpenDebug(/* uid?: string, */ isAdmin?: boolean) {
  return process.env.NODE_ENV !== "production" || isAdmin === true;
}

