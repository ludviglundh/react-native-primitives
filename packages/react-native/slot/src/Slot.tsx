import {composeRefs} from '@radix-ui/react-compose-refs';
import * as React from 'react';

interface SlotProps {
  children?: React.ReactNode;
}

type ReactChildWithRef = React.ReactElement & {
  ref?: React.Ref<unknown>;
};

const Slot = React.forwardRef<any, SlotProps>((props, forwardedRef) => {
  const {children, ...slotProps} = props;
  const childrenArray = React.Children.toArray(children);
  const slottable = childrenArray.find(isSlottable);

  if (slottable) {
    const newElement = slottable.props.children as React.ReactNode;

    const newChildren = childrenArray.map(child => {
      if (child === slottable) {
        if (React.Children.count(newElement) > 1) {
          return React.Children.only(null);
        }

        return React.isValidElement(newElement)
          ? (newElement.props.children as React.ReactNode)
          : null;
      } else {
        return child;
      }
    });

    return (
      <SlotClone {...slotProps} ref={forwardedRef}>
        {React.isValidElement(newElement)
          ? React.cloneElement(newElement, undefined, newChildren)
          : null}
      </SlotClone>
    );
  }

  return (
    <SlotClone {...slotProps} ref={forwardedRef}>
      {children}
    </SlotClone>
  );
});

interface SlotCloneProps {
  children: React.ReactNode;
}

const SlotClone = React.forwardRef<any, SlotCloneProps>(
  (props, forwardedRef) => {
    const {children, ...slotProps} = props;

    if (React.isValidElement(children)) {
      return React.cloneElement(children, {
        ...mergeProps(slotProps, children.props),
        // @ts-ignore
        ref: forwardedRef
          ? composeRefs(forwardedRef, (children as ReactChildWithRef).ref)
          : (children as ReactChildWithRef).ref,
      });
    }
  },
);

const Slottable = ({children}: {children: React.ReactNode}) => {
  return <>{children}</>;
};

function isSlottable(child: React.ReactNode): child is React.ReactElement {
  return React.isValidElement(child) && child.type === Slottable;
}

type AnyProps = Record<string, any>;

function mergeProps(slotProps: AnyProps, childProps: AnyProps) {
  // all child props should override
  const overrideProps = {...childProps};

  for (const propName in childProps) {
    const slotPropValue = slotProps[propName];
    const childPropValue = childProps[propName];

    const isHandler = /^on[A-Z]/.test(propName);
    if (isHandler) {
      // if the handler exists on both, we compose them
      if (slotPropValue && childPropValue) {
        overrideProps[propName] = (...args: unknown[]) => {
          childPropValue(...args);
          slotPropValue(...args);
        };
      }
      // but if it exists only on the slot, we use only this one
      else if (slotPropValue) {
        overrideProps[propName] = slotPropValue;
      }
    }
    // if it's `style`, we merge them
    else if (propName === 'style') {
      overrideProps[propName] = {...slotPropValue, ...childPropValue};
    }
  }

  return {...slotProps, ...overrideProps};
}

const Root = Slot;
export {Slot, Slottable, Root};

export type {SlotProps};
