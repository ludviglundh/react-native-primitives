import React from 'react';
import {
  FlatList,
  Modal,
  ScrollView,
  SectionList,
  Switch,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from 'react-native';
import {Slot} from '../../slot';

const componentMapping = {
  Text: Text as typeof Text,
  TouchableOpacity: TouchableOpacity as typeof TouchableOpacity,
  View: View as typeof View,
  ScrollView: ScrollView as typeof ScrollView,
  FlatList: FlatList as typeof FlatList,
  SectionList: SectionList as typeof SectionList,
  TouchableHighlight: TouchableHighlight as typeof TouchableHighlight,
  Switch: Switch as typeof Switch,
  Modal: Modal as typeof Modal,
};

const NODES = Object.keys(componentMapping).map(
  c => c as keyof typeof componentMapping,
);

type PropsWithoutRef<P> = P extends any
  ? 'ref' extends keyof P
    ? Pick<P, Exclude<keyof P, 'ref'>>
    : P
  : P;

type ComponentPropsWithoutRef<T extends keyof typeof componentMapping> =
  PropsWithoutRef<React.ComponentProps<(typeof componentMapping)[T]>>;

type PrimitiveForwardRefComponent<E extends keyof typeof componentMapping> =
  React.ForwardRefExoticComponent<
    ComponentPropsWithoutRef<E> &
      React.RefAttributes<InstanceType<(typeof componentMapping)[E]>>
  > &
    PrimitivePropsWithRef<E>;

type PrimitivePropsWithRef<E extends keyof typeof componentMapping> =
  React.ComponentPropsWithRef<(typeof componentMapping)[E]> & {
    asChild?: boolean;
  };

type Primitives = {
  [E in keyof typeof componentMapping]: PrimitiveForwardRefComponent<E>;
};

const Primitive = NODES.reduce((primitive, node) => {
  const Node = React.forwardRef(
    (
      props: ComponentPropsWithoutRef<typeof node> & {asChild?: boolean},
      forwardedRef: React.Ref<
        InstanceType<(typeof componentMapping)[typeof node]>
      >,
    ) => {
      const {asChild, ...primitiveProps} = props;
      const Comp: any = asChild ? Slot : componentMapping[node];

      return React.createElement(Comp, {...primitiveProps, ref: forwardedRef});
    },
  );

  Node.displayName = `Primitive.${node}`;

  return {...primitive, [node]: Node};
}, {} as Primitives);

const Root = Primitive;

export {Primitive, Root};

export type {ComponentPropsWithoutRef, PrimitivePropsWithRef};
