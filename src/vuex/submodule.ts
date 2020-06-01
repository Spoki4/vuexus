import 'reflect-metadata'

type SubModule<T> = {
  cls: T,
  type: 'submodule'
}

export const isSubModule = <T>(field: any): field is SubModule<T>  => {
  return field?.type === 'submodule' && field?.cls
}

export const getSubModuleClass = <T>(field: SubModule<T>) => field.cls

export const createSubModule = <T extends { new() }>(Class: T): InstanceType<T> => {
  return {cls: Class, type: 'submodule'} as InstanceType<T>
}

