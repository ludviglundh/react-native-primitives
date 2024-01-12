/* eslint-disable react-native/no-inline-styles */
import * as React from 'react';
import {composeEventHandlers} from '@radix-ui/primitive';
import {useComposedRefs} from '@radix-ui/react-compose-refs';
import {createContextScope} from '@radix-ui/react-context';
import {useId} from '@radix-ui/react-id';
import {useControllableState} from '@radix-ui/react-use-controllable-state';
import type {Scope} from '@radix-ui/react-context';

import {Primitive} from '../../primitive';
import {PrimitivePropsWithRef} from '../../primitive/src/Primitive';

const DIALOG_NAME = 'Dialog';

type ScopedProps<P> = P & {__scopeDialog?: Scope};
type PrimitiveTouchableOpacityElement = React.ElementRef<
  typeof Primitive.TouchableOpacity
>;
type PrimitiveTextElement = React.ElementRef<typeof Primitive.Text>;
type PrimitiveTouchableOpacityProps = PrimitivePropsWithRef<'TouchableOpacity'>;
type PrimitiveTextProps = PrimitivePropsWithRef<'Text'>;

const [createDialogContext, createDialogScope] =
  createContextScope(DIALOG_NAME);

type DialogContextValue = {
  triggerRef: React.RefObject<PrimitiveTouchableOpacityElement>;
  contentRef: React.RefObject<DialogContentElement>;
  contentId: string;
  titleId: string;
  descriptionId: string;
  open: boolean;
  onOpenChange(open: boolean): void;
  onOpenToggle(): void;
};

const [DialogProvider, useDialogContext] =
  createDialogContext<DialogContextValue>(DIALOG_NAME);

interface DialogProps extends React.PropsWithChildren {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?(open: boolean): void;
}

const Dialog: React.FC<ScopedProps<DialogProps>> = props => {
  const {
    __scopeDialog,
    children,
    open: openProp,
    defaultOpen,
    onOpenChange,
  } = props;

  const triggerRef = React.useRef<PrimitiveTouchableOpacityElement>(null);
  const contentRef = React.useRef<DialogContentElement>(null);

  const [open = false, setOpen] = useControllableState({
    prop: openProp,
    defaultProp: defaultOpen,
    onChange: onOpenChange,
  });

  return (
    <DialogProvider
      scope={__scopeDialog}
      triggerRef={triggerRef}
      contentRef={contentRef}
      contentId={useId()}
      titleId={useId()}
      descriptionId={useId()}
      open={open}
      onOpenChange={setOpen}
      onOpenToggle={React.useCallback(
        () => setOpen(prevOpen => !prevOpen),
        [setOpen],
      )}>
      <Primitive.View style={{flex: 1}}>{children}</Primitive.View>
    </DialogProvider>
  );
};

Dialog.displayName = DIALOG_NAME;

const TRIGGER_NAME = 'DialogTrigger';

type DialogTriggerElement = PrimitiveTouchableOpacityElement;

interface DialogTriggerProps extends PrimitiveTouchableOpacityProps {}

const DialogTrigger = React.forwardRef<
  DialogTriggerElement,
  ScopedProps<DialogTriggerProps>
>((props, forwardedRef) => {
  const {__scopeDialog, children, ...triggerProps} = props;

  const context = useDialogContext(TRIGGER_NAME, __scopeDialog);
  const composedTriggerRef = useComposedRefs(forwardedRef, context.triggerRef);

  return (
    <Primitive.TouchableOpacity
      {...triggerProps}
      ref={composedTriggerRef}
      onPress={composeEventHandlers(
        triggerProps.onPress,
        context.onOpenToggle,
      )}>
      {children}
    </Primitive.TouchableOpacity>
  );
});

const PORTAL_NAME = 'DialogPortal';

type DialogPortalElement = React.ElementRef<typeof Primitive.Modal>;
interface DialogPortalProps
  extends Omit<PrimitivePropsWithRef<'Modal'>, 'visible' | 'onRequestClose'> {}

const DialogPortal = React.forwardRef<
  DialogPortalElement,
  ScopedProps<DialogPortalProps>
>((props, forwardedRef) => {
  const {__scopeDialog, transparent = true, ...portalProps} = props;
  const context = useDialogContext(PORTAL_NAME, __scopeDialog);

  return (
    <Primitive.Modal
      ref={forwardedRef}
      {...portalProps}
      visible={context.open}
      onRequestClose={context.onOpenToggle}
      transparent={transparent}
    />
  );
});

DialogPortal.displayName = PORTAL_NAME;

const OVERLAY_NAME = 'DialogOverlay';

type PrimitiveViewElement = React.ElementRef<typeof Primitive.View>;
type PrimitiveViewProps = PrimitivePropsWithRef<'View'>;

type DialogOverlayElement = PrimitiveViewElement;
interface DialogOverlayProps extends PrimitiveViewProps {}

const DialogOverlay = React.forwardRef<
  DialogOverlayElement,
  DialogOverlayProps
>((props: ScopedProps<DialogOverlayProps>, forwardedRef) => {
  return (
    <Primitive.View
      {...props}
      ref={forwardedRef}
      style={{
        pointerEvents: 'auto',
        ...(typeof props.style === 'object' && props.style !== null
          ? props.style
          : {}),
      }}
    />
  );
});

DialogOverlay.displayName = OVERLAY_NAME;

type DialogContentElement = PrimitiveViewElement;
interface DialogContentProps extends PrimitiveViewProps {}

const CONTENT_NAME = 'DialogContent';

const DialogContent = React.forwardRef<
  DialogContentElement,
  ScopedProps<DialogContentProps>
>((props, forwardedRef) => {
  const {__scopeDialog, ...contentProps} = props;
  const context = useDialogContext(CONTENT_NAME, __scopeDialog);
  const composedRefs = useComposedRefs(forwardedRef, context.contentRef);

  return context.open ? (
    <Primitive.View
      {...contentProps}
      ref={composedRefs}
      id={context.contentId}
    />
  ) : null;
});

DialogContent.displayName = CONTENT_NAME;

const TITLE_NAME = 'DialogTitle';

type DialogTitleElement = PrimitiveTextElement;

interface DialogTitleProps extends PrimitiveTextProps {}

const DialogTitle = React.forwardRef<DialogTitleElement, DialogTitleProps>(
  (props: ScopedProps<DialogTitleProps>, forwardedRef) => {
    const {__scopeDialog, ...titleProps} = props;
    const context = useDialogContext(TITLE_NAME, __scopeDialog);
    return (
      <Primitive.Text id={context.titleId} {...titleProps} ref={forwardedRef} />
    );
  },
);

DialogTitle.displayName = TITLE_NAME;

const DESCRIPTION_NAME = 'DialogDescription';

type DialogDescriptionElement = PrimitiveTextElement;

interface DialogDescriptionProps extends PrimitiveTextProps {}

const DialogDescription = React.forwardRef<
  DialogDescriptionElement,
  DialogDescriptionProps
>((props: ScopedProps<DialogTitleProps>, forwardedRef) => {
  const {__scopeDialog, ...titleProps} = props;
  const context = useDialogContext(TITLE_NAME, __scopeDialog);
  return (
    <Primitive.Text
      id={context.descriptionId}
      {...titleProps}
      ref={forwardedRef}
    />
  );
});

DialogDescription.displayName = DESCRIPTION_NAME;

const CLOSE_NAME = 'DialogClose';

type DialogCloseElement = PrimitiveTouchableOpacityElement;
interface DialogCloseProps extends PrimitiveTouchableOpacityProps {}

const DialogClose = React.forwardRef<
  DialogCloseElement,
  ScopedProps<DialogCloseProps>
>((props, forwardedRef) => {
  const {__scopeDialog, ...closeProps} = props;
  const context = useDialogContext(CLOSE_NAME, __scopeDialog);
  return (
    <Primitive.TouchableOpacity
      {...closeProps}
      ref={forwardedRef}
      onPress={composeEventHandlers(props.onPress, () =>
        context.onOpenChange(false),
      )}
    />
  );
});

DialogClose.displayName = CLOSE_NAME;

const Root = Dialog;
const Trigger = DialogTrigger;
const Portal = DialogPortal;
const Overlay = DialogOverlay;
const Content = DialogContent;
const Title = DialogTitle;
const Description = DialogDescription;
const Close = DialogClose;

export {
  createDialogScope,
  //
  Dialog,
  DialogTrigger,
  DialogPortal,
  DialogOverlay,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
  //
  Root,
  Trigger,
  Portal,
  Overlay,
  Content,
  Title,
  Description,
  Close,
};
export type {
  DialogProps,
  DialogTriggerProps,
  DialogTriggerElement,
  DialogPortalProps,
  DialogOverlayProps,
  DialogOverlayElement,
  DialogContentProps,
  DialogContentElement,
  DialogTitleProps,
  DialogTitleElement,
  DialogDescriptionProps,
  DialogDescriptionElement,
  DialogCloseProps,
  DialogCloseElement,
};
