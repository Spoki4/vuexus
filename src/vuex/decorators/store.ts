export const Store = (target) => {
  const name = target.name
  target.__name__ = name
  return target
}
