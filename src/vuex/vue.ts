// TODO: remove eslint-disable
/* eslint-disable no-unused-vars */
import Vue from 'vue'
import {ThisTypedComponentOptionsWithArrayProps, ThisTypedComponentOptionsWithRecordProps} from 'vue/types/options'
import {ExtendedVue} from 'vue/types/vue'

declare module 'vue/types/options' {
  interface ComponentOptions<V extends Vue> {
    stores?: ObjectClass
  }
}

export type ObjectClass = { [key: string]: { new () } }
type StoresDefinition<Stores extends ObjectClass> = {[Key in keyof Stores]: Stores[Key]}
type StoresInstances<Stores extends ObjectClass> = {[Key in keyof Stores]: InstanceType<Stores[Key]>}

declare module 'vue/types/vue' {
  interface VueConstructor<V extends Vue> {
    extend<S extends ObjectClass, Data, Methods, Computed, PropNames extends string = never>(
      options?: { stores: StoresDefinition<S> } & ThisTypedComponentOptionsWithArrayProps<
        StoresInstances<S> & V,
        Data,
        Methods,
        Computed,
        PropNames
        >,
    ): ExtendedVue<V, Data, Methods, Computed, Record<PropNames, any>>

    extend<S extends ObjectClass, Data, Methods, Computed, Props>(
      options?: { stores: StoresDefinition<S> } & ThisTypedComponentOptionsWithRecordProps<
        StoresInstances<S> & V,
        Data,
        Methods,
        Computed,
        Props
        >,
    ): ExtendedVue<V, Data, Methods, Computed, Props>
  }
}
