export const addArrayKeyMetadata = (metadataKey: string, key: string, target: { new() }) => {
  let metadata = Reflect.getMetadata(metadataKey, target)

  if (!metadata) metadata = []
  metadata.push(key)

  Reflect.defineMetadata(metadataKey, metadata, target)
}
